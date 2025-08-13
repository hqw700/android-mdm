// src/pages/DeviceList/index.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message } from 'antd';
import { getDevices, lockDevice } from '../../api/deviceService';
import { useNavigate } from 'react-router-dom';

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
      console.log('API 返回的数据:', response.data); // 打印返回的数据
      setDevices(response.data);
      console.log('状态已更新:', devices); // 注意：这里可能不会立即显示最新状态
    } catch (error) {
      message.error('获取设备列表失败');
    }
    setLoading(false);
  };


  const handleLockDevice = async (deviceId) => {
    try {
      await lockDevice(deviceId);
      message.success(`已向设备 ${deviceId} 发送远程锁定指令`);
    } catch (error) {
      message.error('发送远程锁定指令失败');
    }
  };

  const columns = [
    { title: '终端ID', dataIndex: 'device_id', key: 'device_id' },
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: 'IP地址', dataIndex: 'ip_address', key: 'ip_address' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '最后心跳', dataIndex: 'last_heartbeat', key: 'last_heartbeat' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => navigate(`/devices/${record.device_id}`)}>查看详情</Button>
          <Button danger onClick={() => handleLockDevice(record.device_id)}>远程锁定</Button>
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