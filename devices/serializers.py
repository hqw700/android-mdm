from rest_framework import serializers
from .models import Device

class DeviceSerializer(serializers.ModelSerializer):
    jpush_status = serializers.SerializerMethodField()

    class Meta:
        model = Device
        fields = ['device_id', 'fcm_token', 'name', 'model', 'ip_address', 'mac_address',
                   'os_version', 'software_version', 'status', 'last_check_status', 'groups', 'last_heartbeat', 'created_at', 'jpush_status']

    def get_jpush_status(self, obj):
        # This method will be populated in the view
        return None
