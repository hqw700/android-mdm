from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Device
from .serializers import DeviceSerializer

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