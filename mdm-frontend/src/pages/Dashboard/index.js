// src/pages/Dashboard/index.js
import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { AndroidOutlined, ApiOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';

const Dashboard = () => {
  // Placeholder data
  const totalDevices = 150;
  const onlineDevices = 120;
  const offlineDevices = 30;
  const apiStatus = "正常";

  return (
    <div>
      <h1>看板</h1>
      <p>欢迎来到您的设备管理中心。</p>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总设备数"
              value={totalDevices}
              prefix={<AndroidOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={onlineDevices}
              valueStyle={{ color: '#3f8600' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="离线设备"
              value={offlineDevices}
              valueStyle={{ color: '#cf1322' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="API状态"
              value={apiStatus}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ApiOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
