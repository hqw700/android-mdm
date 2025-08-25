// src/components/MainLayout/index.js
import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { DashboardOutlined, AppstoreOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="logo" style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', color: 'white', textAlign: 'center', lineHeight: '32px' }}>MDM</div>
        <Menu theme="dark" selectedKeys={[location.pathname]} mode="inline">
          <Menu.Item key="/" icon={<DashboardOutlined />}>
            <Link to="/">看板</Link>
          </Menu.Item>
          <Menu.Item key="/devices" icon={<AppstoreOutlined />}>
            <Link to="/devices">设备列表</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: '16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
