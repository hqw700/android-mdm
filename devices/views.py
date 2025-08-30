from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Device
from .serializers import DeviceSerializer
from django.conf import settings
import requests
import base64
from rest_framework.decorators import api_view

def get_jpush_device_status(registration_id):
    app_key = settings.JPUSH_APP_KEY
    master_secret = settings.JPUSH_MASTER_SECRET

    if not app_key or not master_secret or master_secret == 'YOUR_MASTER_SECRET':
        return {'error': 'JPush credentials not configured'}

    url = f'https://device.jpush.cn/v3/devices/{registration_id}'
    auth_string = f'{app_key}:{master_secret}'
    base64_auth_string = base64.b64encode(auth_string.encode('utf-8')).decode('utf-8')

    headers = {
        'Authorization': f'Basic {base64_auth_string}',
        'Accept': 'application/json'
    }

    try:
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.json()
    except requests.exceptions.RequestException as e:
        return {'error': str(e)}

class DeviceRegisterView(generics.CreateAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    # 设置认证和权限，最小系统可暂时不设
    # authentication_classes = [...]
    # permission_classes = [...]

class DeviceUpdateView(generics.UpdateAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    lookup_field = 'device_id'  # 通过 device_id 查找设备进行更新

class DeviceGetView(generics.RetrieveAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    lookup_field = 'device_id'  # 通过 device_id 查找设备进行更新
    
class DeviceListView(generics.ListAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        for device_data in data:
            if device_data.get('fcm_token'):
                jpush_status = get_jpush_device_status(device_data['fcm_token'])
                device_data['jpush_status'] = jpush_status

        return Response(data)

class DeviceDeleteView(generics.DestroyAPIView):
    """
    删除单个设备
    """
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    lookup_field = 'device_id'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        # 在这里可以添加额外的删除逻辑，例如记录日志等
        instance.delete()

@api_view(['GET'])
def get_device_status(request, registration_id):
    status_data = get_jpush_device_status(registration_id)
    if 'error' in status_data:
        return Response(status_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(status_data)
