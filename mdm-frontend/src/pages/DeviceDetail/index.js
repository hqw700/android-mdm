// src/pages/DeviceDetail/index.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions, Spin, message } from 'antd';
import { getDeviceDetail } from '../../api/deviceService';

const DeviceDetail = () => {
  const { deviceId } = useParams();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 使用一个标志位来防止组件卸载后仍然更新状态
    // 这有助于在严格模式下避免竞态条件和内存泄漏
    let isMounted = true;

    const fetchDeviceDetail = async () => {
      setLoading(true);
      try {
        const response = await getDeviceDetail(deviceId);
        if (isMounted) {
          console.log('API 返回的数据:', response.data); // 保留用于调试
          setDevice(response.data);
        }
      } catch (error) {
        if (isMounted) {
          message.error('获取设备详情失败');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDeviceDetail();

    return () => {
      isMounted = false;
    };
  }, [deviceId]);

  if (loading) {
    return <Spin tip="加载中..." />;
  }

  if (!device) {
    return <div>找不到设备或数据为空</div>;
  }

  return (
    <Card title="设备详情" style={{ width: '100%' }}>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="终端ID">{device.device_id}</Descriptions.Item>
        <Descriptions.Item label="设备名称">{device.name}</Descriptions.Item>
        <Descriptions.Item label="终端型号">{device.model}</Descriptions.Item>
        <Descriptions.Item label="IP地址">{device.ip_address}</Descriptions.Item>
        <Descriptions.Item label="Mac地址">{device.mac_address || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="操作系统版本">{device.os_version}</Descriptions.Item>
        <Descriptions.Item label="软件版本">{device.software_version}</Descriptions.Item>
        <Descriptions.Item label="状态">{device.status}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default DeviceDetail;