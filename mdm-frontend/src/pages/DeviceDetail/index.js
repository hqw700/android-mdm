// src/pages/DeviceDetail/index.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Spin, message, Button, Modal, Space, Tag } from 'antd';
import { getDeviceDetail, deleteDevice, getDeviceStatus } from '../../api/deviceService';

const { confirm } = Modal;

const DeviceDetail = () => {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

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

  const handleCheckStatus = async () => {
    if (!device || !device.fcm_token) {
      message.error('无法获取设备 Registration ID');
      return;
    }
    setStatusLoading(true);
    try {
      const response = await getDeviceStatus(device.fcm_token);
      // A successful response means the device is known to JPush.
      setOnlineStatus({ online: true, ...response.data });
    } catch (error) {
      message.error('查询在线状态失败');
      setOnlineStatus({ online: false });
    } finally {
      setStatusLoading(false);
    }
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
        <Button onClick={handleCheckStatus} loading={statusLoading}>查询在线状态</Button>
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
        {onlineStatus && (
          <>
            <Descriptions.Item label="JPush在线状态" span={2}>
              {onlineStatus.online ? <Tag color="green">在线</Tag> : <Tag color="red">离线</Tag>}
            </Descriptions.Item>
            {onlineStatus.alias && (
              <Descriptions.Item label="JPush Alias">{onlineStatus.alias}</Descriptions.Item>
            )}
            {onlineStatus.tags && (
              <Descriptions.Item label="JPush Tags">{onlineStatus.tags.join(', ')}</Descriptions.Item>
            )}
          </>
        )}
      </Descriptions>
    </Card>
  );
};

export default DeviceDetail;