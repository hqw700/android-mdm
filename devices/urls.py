from django.urls import path
from .views import (
    DeviceRegisterView,
    DeviceUpdateView,
    DeviceGetView,
    DeviceListView,
    DeviceDeleteView,
    SendCommandView,
)

urlpatterns = [
    path('register/', DeviceRegisterView.as_view(), name='device-register'),
    path('update/<str:device_id>/', DeviceUpdateView.as_view(), name='device-update'),
    path('list/all/', DeviceListView.as_view(), name='device-list-all'),
    path('command/', SendCommandView.as_view(), name='send_command'),
    path('<str:device_id>/delete/', DeviceDeleteView.as_view(), name='device-delete'),
    path('<str:device_id>/', DeviceGetView.as_view(), name='device-get'),
]
