from django.db import models

class Device(models.Model):
    # 设备唯一标识，通常由前端生成并上报，例如 IMEI、序列号等
    device_id = models.CharField(max_length=255, unique=True)
    # 设备 FCM 推送令牌，用于下发指令
    fcm_token = models.CharField(max_length=255, blank=True, null=True)
    # 设备名称，例如 "小米11"
    name = models.CharField(max_length=100, blank=True, null=True)
    # 最后一次上报心跳时间
    last_heartbeat = models.DateTimeField(auto_now=True)
    # 更多设备信息字段，可根据需求添加
    # 例如：os_version = models.CharField(...)
    #       battery_level = models.IntegerField(...)

    def __str__(self):
        return f"{self.name} ({self.device_id})"