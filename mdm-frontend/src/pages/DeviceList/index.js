// src/pages/DeviceList/index.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Tag, Dropdown, Menu, Form, Input, Select } from 'antd';
import { getDevices, sendCommand, deleteDevice } from '../../api/deviceService';
import { useNavigate } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Option } = Select;

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isGroupActionModalOpen, setIsGroupActionModalOpen] = useState(false);
  const [form] = Form.useForm();
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

  const handleCommand = async (payload) => {
    try {
      await sendCommand(payload);
      message.success('指令发送成功');
    } catch (error) {
      message.error(`发送指令失败: ${error.message}`);
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

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleGroupAction = () => {
    setIsGroupActionModalOpen(true);
  };

  const handleGroupActionOk = () => {
    form.validateFields().then(values => {
      const { target_type, target, command } = values;
      const payload = {
        target_type,
        target,
        command: { command },
      };
      handleCommand(payload);
      setIsGroupActionModalOpen(false);
      form.resetFields();
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

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
      render: (_, record) => {
        const menuItems = [
          { key: 'lock', label: '远程锁定' },
          { key: 'disable_camera', label: '禁止摄像头' },
          { key: 'enable_camera', label: '启用摄像头' },
          { key: 'delete', label: '删除设备', danger: true },
        ];

        return (
          <Space size="middle">
            <Button onClick={() => navigate(`/devices/${record.device_id}`)}>查看详情</Button>
            <Dropdown menu={{ items: menuItems, onClick: ({ key }) => {
              if (key === 'delete') {
                handleDeleteDevice(record.device_id);
              } else {
                const payload = {
                  target_type: 'registration_id',
                  target: record.fcm_token,
                  command: { command: key },
                };
                handleCommand(payload);
              }
            } }}>
              <Button>
                更多操作 <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <h1>设备列表</h1>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={fetchDevices} style={{ marginRight: 8 }}>刷新列表</Button>
        <Button type="primary" onClick={handleGroupAction} disabled={!hasSelected}>
          批量操作
        </Button>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `已选择 ${selectedRowKeys.length} 个设备` : ''}
        </span>
      </div>
      <Table 
        rowSelection={rowSelection}
        columns={columns}
        dataSource={devices}
        loading={loading} 
        rowKey="device_id" 
      />
      <Modal
        title="批量操作"
        open={isGroupActionModalOpen}
        onOk={handleGroupActionOk}
        onCancel={() => setIsGroupActionModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="target_type" label="目标类型" rules={[{ required: true }]}>
            <Select placeholder="选择目标类型">
              <Option value="tag">标签</Option>
              <Option value="alias">别名</Option>
              <Option value="broadcast">广播</Option>
            </Select>
          </Form.Item>
          <Form.Item name="target" label="目标">
            <Input placeholder="输入目标 (例如, 标签名)" />
          </Form.Item>
          <Form.Item name="command" label="指令" rules={[{ required: true }]}>
            <Select placeholder="选择指令">
              <Option value="lock">远程锁定</Option>
              <Option value="disable_camera">禁止摄像头</Option>
              <Option value="enable_camera">启用摄像头</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeviceList;