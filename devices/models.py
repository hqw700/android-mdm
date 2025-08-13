from django.db import models

class Device(models.Model):
    # 设备基本信息
    device_id = models.CharField(max_length=255, unique=True, verbose_name="终端唯一标识")
    fcm_token = models.CharField(max_length=255, blank=True, null=True, verbose_name="推送令牌")
    name = models.CharField(max_length=100, blank=True, null=True, verbose_name="设备名称")
    
    model = models.CharField(max_length=100, blank=True, null=True, verbose_name="终端型号")
    ip_address = models.GenericIPAddressField(blank=True, null=True, verbose_name="IP地址")
    mac_address = models.CharField(max_length=17, blank=True, null=True, verbose_name="Mac地址")
    os_version = models.CharField(max_length=50, blank=True, null=True, verbose_name="操作系统版本")
    software_version = models.CharField(max_length=50, blank=True, null=True, verbose_name="软件版本")
    
    # 状态信息
    status = models.CharField(max_length=20, default='online', verbose_name="状态") # 例如：online, offline, pending
    
    # 推送信息

    
    # 巡检信息 (可以考虑将巡检结果存储到单独的表中)
    last_check_status = models.JSONField(blank=True, null=True, verbose_name="上次巡检结果")

    # 分组信息
    groups = models.ManyToManyField('Group', blank=True, verbose_name="所属分组")

    # 时间戳
    last_heartbeat = models.DateTimeField(auto_now=True, verbose_name="最后心跳时间")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    def __str__(self):
        return f"{self.name} ({self.device_id})"

class Group(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="分组名称")
    description = models.TextField(blank=True, null=True, verbose_name="分组描述")
    is_virtual = models.BooleanField(default=False, verbose_name="是否为虚拟分组")
    # 如果是虚拟分组，可以定义规则字段，例如：rules = models.JSONField()

    def __str__(self):
        return self.name
    
class Command(models.Model):
    CMD_CHOICES = (
        ('upgrade_image', '镜像升级'),
        ('upgrade_system', '系统升级'),
        ('check_system', '系统巡检'),
        # ... 更多命令
    )
    command_type = models.CharField(max_length=50, choices=CMD_CHOICES)
    target_device = models.ForeignKey(Device, on_delete=models.CASCADE)
    parameters = models.JSONField(blank=True, null=True) # 例如：升级文件的URL
    status = models.CharField(max_length=20, default='pending') # 例如：pending, sent, completed, failed
    created_at = models.DateTimeField(auto_now_add=True)
