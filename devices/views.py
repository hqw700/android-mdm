from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Device
from .serializers import DeviceSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

class DeviceRegisterView(generics.CreateAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer

class DeviceUpdateView(generics.UpdateAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    lookup_field = 'device_id'

class DeviceGetView(generics.RetrieveAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    lookup_field = 'device_id'
    
class DeviceListView(generics.ListAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer

class DeviceDeleteView(generics.DestroyAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    lookup_field = 'device_id'

class SendCommandView(APIView):
    def post(self, request, *args, **kwargs):
        target_type = request.data.get('target_type')
        target = request.data.get('target')
        command_data = request.data.get('command')

        if not all([target_type, command_data]):
            return Response({'error': 'Missing parameters'}, status=status.HTTP_400_BAD_REQUEST)

        channel_layer = get_channel_layer()

        if target_type == 'registration_id':
            targets = [t.strip() for t in target.split(',')]
            for device_id in targets:
                async_to_sync(channel_layer.group_send)(
                    f'device_{device_id}',
                    {
                        'type': 'device.message',
                        'message': command_data
                    }
                )
        elif target_type == 'broadcast':
             async_to_sync(channel_layer.group_send)(
                    f'devices',
                    {
                        'type': 'device.message',
                        'message': command_data
                    }
                )
        else:
            return Response({'error': 'Invalid target_type'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'status': 'Command sent'}, status=status.HTTP_200_OK)