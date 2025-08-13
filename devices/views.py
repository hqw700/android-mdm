from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.response import Response
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

class DeviceGetView(generics.ListAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    lookup_field = 'device_id'  # 通过 device_id 查找设备进行更新

    def get_queryset(self):
        print("KWARGS:", self.kwargs)  # 检查接收到的参数
        device_id = self.kwargs.get('device_id')
        if device_id:
            return Device.objects.filter(device_id=device_id)
        return Device.objects.all() # 如果没有提供 device_id，则返回所有设备
    
class DeviceListView(generics.ListAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer

    def get_queryset(self):
        print("KWARGS:", self.kwargs)  # 检查接收到的参数
        queryset = Device.objects.all()
        print("QUERYSET SQL:", str(queryset.query))  # 查看生成的SQL
        return queryset

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