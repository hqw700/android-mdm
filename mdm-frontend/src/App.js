// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import DeviceList from './pages/DeviceList';
import DeviceDetail from './pages/DeviceDetail';

const { Header, Content, Footer } = Layout;

const App = () => {
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Link to="/">设备列表</Link>
            </Menu.Item>
            {/* 你可以在这里添加更多菜单项，例如分组管理 */}
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <div className="site-layout-content" style={{ padding: 24, minHeight: 380 }}>
            <Routes>
              <Route path="/" element={<DeviceList />} />
              <Route path="/devices/:deviceId" element={<DeviceDetail />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>MDM ©2025 Created by Your Team</Footer>
      </Layout>
    </Router>
  );
};



export default App;