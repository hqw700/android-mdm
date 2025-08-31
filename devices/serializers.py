from rest_framework import serializers
from .models import Device
from django.core.cache import cache

class DeviceSerializer(serializers.ModelSerializer):
    online_status = serializers.SerializerMethodField()

    class Meta:
        model = Device
        fields = ['device_id', 'fcm_token', 'name', 'model', 'ip_address', 'mac_address',
                   'os_version', 'software_version', 'status', 'last_check_status', 'groups', 'last_heartbeat', 'created_at', 'online_status']

    def get_online_status(self, obj):
        return cache.get(f'device_online_{obj.device_id}', False)
