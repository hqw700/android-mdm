from rest_framework import generics
from .models import Device
from .serializers import DeviceSerializer

# class DeviceRegisterView(generics.CreateAPIView):
#     queryset = Device.objects.all()
#     serializer_class = DeviceSerializer
#     # 设置认证和权限，最小系统可暂时不设
#     # authentication_classes = [...]
#     # permission_classes = [...]

# class DeviceUpdateView(generics.UpdateAPIView):
#     queryset = Device.objects.all()
#     serializer_class = DeviceSerializer
#     lookup_field = 'device_id'  # 通过 device_id 查找设备进行更新

from django.urls import path
from .views import DeviceRegisterView, DeviceUpdateView, DeviceGetView, DeviceListView, DeviceDeleteView

urlpatterns = [
    path('register/', DeviceRegisterView.as_view(), name='device-register'),
    path('update/<str:device_id>/', DeviceUpdateView.as_view(), name='device-update'),
    path('<str:device_id>/', DeviceGetView.as_view(), name='device-get'), #http://127.0.0.1:8000/api/devices/test2/
    path('list/all/', DeviceListView.as_view(), name='device-list-all'),  # http://127.0.0.1:8000/api/devices/list/all/
    path('<str:device_id>/delete/', DeviceDeleteView.as_view(), name='device-delete'),
]