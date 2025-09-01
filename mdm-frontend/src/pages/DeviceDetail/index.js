// src/pages/DeviceDetail/index.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Spin, message, Button, Modal, Space, Tag } from 'antd';
import { getDeviceDetail, deleteDevice, sendCommand } from '../../api/deviceService';

const { confirm } = Modal;

const DeviceDetail = () => {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDeviceDetail = async () => {
    setLoading(true);
    try {
      const response = await getDeviceDetail(deviceId);
      setDevice(response.data);
    } catch (error) {
      message.error('获取设备详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceDetail();
  }, [deviceId]);

  const handleDeleteDevice = () => {
    confirm({
      title: '确定要删除这个设备吗?',
      content: `设备ID: ${deviceId}`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        return new Promise(async (resolve, reject) => {
          try {
            await deleteDevice(deviceId);
            message.success(`设备 ${deviceId} 已被删除`);
            navigate('/'); // Navigate back to the device list
            resolve();
          } catch (error) {
            message.error('删除设备失败');
            reject(error);
          }
        });
      },
    });
  };

  const handleGetLocation = async () => {
    const payload = {
      target_type: 'registration_id',
      target: device.device_id,
      command: { command: 'get_location' },
    };
    await sendCommand(payload);
    message.info('获取位置指令已发送，请稍后刷新查看');
  };

  if (loading) {
    return <Spin tip="加载中..." />;
  }

  if (!device) {
    return <div>找不到设备或数据为空</div>;
  }

  return (
    <Card title="设备详情" style={{ width: '100%' }} extra={
      <Space>
        <Button onClick={handleGetLocation}>获取位置</Button>
        <Button onClick={fetchDeviceDetail}>刷新</Button>
        <Button danger onClick={handleDeleteDevice}>删除设备</Button>
      </Space>
    }>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="终端ID">{device.device_id}</Descriptions.Item>
        <Descriptions.Item label="设备名称">{device.name}</Descriptions.Item>
        <Descriptions.Item label="终端型号">{device.model}</Descriptions.Item>
        <Descriptions.Item label="IP地址">{device.ip_address}</Descriptions.Item>
        <Descriptions.Item label="RegistrationID">{device.fcm_token || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="操作系统版本">{device.os_version}</Descriptions.Item>
        <Descriptions.Item label="软件版本">{device.software_version}</Descriptions.Item>
        <Descriptions.Item label="状态">{device.status}</Descriptions.Item>
        <Descriptions.Item label="纬度">{device.latitude || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="经度">{device.longitude || 'N/A'}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default DeviceDetail;