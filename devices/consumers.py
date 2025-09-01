import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache
from .models import Device
from channels.db import database_sync_to_async

logger = logging.getLogger(__name__)

class DeviceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logger.info(f"WebSocket scope: {self.scope}")
        self.device_id = self.scope['url_route']['kwargs']['device_id']
        self.device_group_name = f'device_{self.device_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.device_group_name,
            self.channel_name
        )

        await self.accept()
        await self.update_device_online_status(True)
        logger.info(f"Device {self.device_id} connected and added to group {self.device_group_name}")

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.device_group_name,
            self.channel_name
        )
        await self.update_device_online_status(False)
        logger.info(f"Device {self.device_id} disconnected from group {self.device_group_name}")

    # Receive message from WebSocket
    async def receive(self, text_data=None, bytes_data=None):
        if text_data is not None:
            logger.info(f"Received raw message from {self.device_id}: {text_data}")
            try:
                text_data_json = json.loads(text_data)
                logger.info(f"Received message from {self.device_id}: {text_data_json}")

                message_type = text_data_json.get('type')
                if message_type == 'location_update':
                    await self.update_device_location(text_data_json)
            except json.JSONDecodeError as e:
                logger.error(f"JSON decode error: {e} for data: {text_data}")
        elif bytes_data is not None:
            logger.info(f"Received bytes data from {self.device_id}: {bytes_data}")

    # Receive message from room group
    async def device_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def update_device_online_status(self, online):
        cache.set(f'device_online_{self.device_id}', online, timeout=None)

    @database_sync_to_async
    def update_device_location(self, location_data):
        try:
            device = Device.objects.get(device_id=self.device_id)
            device.latitude = location_data.get('latitude')
            device.longitude = location_data.get('longitude')
            device.save()
        except Device.DoesNotExist:
            logger.error(f"Device with id {self.device_id} does not exist.")
