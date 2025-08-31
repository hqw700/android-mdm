import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache

logger = logging.getLogger(__name__)

class DeviceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.device_id = self.scope['url_route']['kwargs']['device_id']
        self.device_group_name = f'device_{self.device_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.device_group_name,
            self.channel_name
        )

        await self.accept()
        cache.set(f'device_online_{self.device_id}', True, timeout=None)
        logger.info(f"Device {self.device_id} connected and added to group {self.device_group_name}")

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.device_group_name,
            self.channel_name
        )
        cache.set(f'device_online_{self.device_id}', False, timeout=None)
        logger.info(f"Device {self.device_id} disconnected from group {self.device_group_name}")

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        # Here you can handle messages from the device, e.g., command responses
        logger.info(f"Received message from {self.device_id}: {text_data_json}")

    # Receive message from room group
    async def device_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps(message))
