// src/pages/DeviceDetail/index.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions, Spin, message } from 'antd';
import { getDeviceDetail } from '../../api/deviceService';


    //  {
    //     "device_id": "dbc7c18d8d6913b4",
    //     "fcm_token": "token",
    //     "name": "generic",
    //     "model": "Cuttlefish x86_64 phone",
    //     "ip_address": "192.168.99.55",
    //     "mac_address": null,
    //     "os_version": "15",
    //     "software_version": "1.0.0",
    //     "status": "online",
    //     "last_check_status": null,
    //     "groups": [],
    //     "last_heartbeat": "2025-08-11T14:25:00.436182Z",
    //     "created_at": "2025-08-11T14:25:00.436223Z"
    // }

const DeviceDetail = () => {
  const { deviceId } = useParams();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDevice(null); 
    fetchDeviceDetail();
  }, [deviceId]);

  const fetchDeviceDetail = async () => {
    setLoading(true);
    try {
      const response = await getDeviceDetail(deviceId);
      console.log('API 返回的数据:', response.data); // 打印返回的数据
      setDevice(response.data);
    } catch (error) {
      message.error('获取设备详情失败');
    }
    setLoading(false);
  };

  if (loading) {
    return <Spin tip="加载中..." />;
  }

  if (!device) {
    return <div>找不到设备</div>;
  }

  return (
    <Card title="设备详情" style={{ width: '100%' }}>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="终端ID">{device.device_id}</Descriptions.Item>
        <Descriptions.Item label="设备名称">{device.name}</Descriptions.Item>
        <Descriptions.Item label="终端型号">{device.model}</Descriptions.Item>
        <Descriptions.Item label="IP地址">{device.ip_address}</Descriptions.Item>
        <Descriptions.Item label="Mac地址">{device.mac_address}</Descriptions.Item>
        <Descriptions.Item label="操作系统版本">{device.os_version}</Descriptions.Item>
        <Descriptions.Item label="软件版本">{device.software_version}</Descriptions.Item>
        <Descriptions.Item label="状态">{device.status}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default DeviceDetail;