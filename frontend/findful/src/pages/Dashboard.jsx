import React from 'react';
import { UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
const { Content, Footer, Sider } = Layout;
import FHeader from '../components/header/Header';
const items = [UnorderedListOutlined, UserOutlined].map((icon, index) => {
  if (index === 0) {
    return {
      key: `sub${index + 1}`,
      icon: React.createElement(icon),
      label: `Listings`,
      children: ['Review', 'Approved', 'Rejected'].map((label, j) => {
        return {
          key: j + 1,
          label: label,
        };
      }),
    };
  } else {
    return {
        key: `sub${index + 1}`,
        icon: React.createElement(icon),
        label: `Users`,
        children: ['Review', 'Approved', 'Banned'].map((label, j) => {
            return {
                key: j + 4,
                label: label,
            }
        }),
    }
  };
});

const Dashboard = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={
        {
            height: '100vh',
        }
    }>
      <FHeader></FHeader>
      <Content
        style={{
          padding: '20px 48px',
          height: '80%',
        }}
      >
        <Layout
          style={{
            padding: '24px 0',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            height: '100%',
          }}
        >
          <Sider
            style={{
              background: colorBgContainer,
              minHeight: '100%',
            }}
            width={200}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{
                height: '100%',
              }}
              items={items}
            />
          </Sider>
          <Content
            style={{
              padding: '0 24px',
                minHeight: '100%',
            }}
            /* Component to load listings/users */
          >
            Content
          </Content>
        </Layout>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
            height: '10%',
        }}
      >
        Fulda University of Applied Sciences Software Engineering Project, Fall 2024 For Demonstration Only
      </Footer>
    </Layout>
  );
};
export default Dashboard;