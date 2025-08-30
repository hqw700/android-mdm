// src/pages/DeviceList/index.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Tag } from 'antd';
import { getDevices, sendCommand, deleteDevice } from '../../api/deviceService';
import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await getDevices();
      setDevices(response.data);
    } catch (error) {
      message.error('获取设备列表失败');
    }
    setLoading(false);
  };


  const handleLockDevice = async (registrationId) => {
    try {
      await sendCommand(registrationId, { command: 'lock' });
      message.success(`已向设备 ${registrationId} 发送远程锁定指令`);
    } catch (error) {
      message.error('发送远程锁定指令失败');
    }
  };

  const handleDeleteDevice = (deviceId) => {
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
            fetchDevices(); // Refresh the list
            resolve();
          } catch (error) {
            message.error('删除设备失败');
            reject(error);
          }
        });
      },
    });
  };

  const columns = [
    { title: '终端ID', dataIndex: 'device_id', key: 'device_id' },
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: 'IP地址', dataIndex: 'ip_address', key: 'ip_address' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { 
      title: 'JPush状态', 
      dataIndex: 'jpush_status', 
      key: 'jpush_status', 
      render: (status) => {
        if (!status || status.error) {
          return <Tag color="red">离线</Tag>;
        }
        return <Tag color="green">在线</Tag>;
      }
    },
    { 
      title: 'JPush Alias', 
      dataIndex: ['jpush_status', 'alias'], 
      key: 'jpush_alias'
    },
    { 
      title: 'JPush Tags', 
      dataIndex: ['jpush_status', 'tags'], 
      key: 'jpush_tags',
      render: (tags) => tags && tags.join(', ')
    },
    { title: '最后心跳', dataIndex: 'last_heartbeat', key: 'last_heartbeat' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => navigate(`/devices/${record.device_id}`)}>查看详情</Button>
          <Button onClick={() => handleLockDevice(record.fcm_token)}>远程锁定</Button>
          <Button danger onClick={() => handleDeleteDevice(record.device_id)}>远程删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>设备列表</h1>
      <Button type="primary" onClick={fetchDevices} style={{ marginBottom: 16 }}>刷新列表</Button>
      <Table 
        columns={columns} 
        dataSource={devices} 
        loading={loading} 
        rowKey="device_id" 
      />
    </div>
  );
};

export default DeviceList;