import React from 'react';
import { UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
const { Content, Footer, Sider } = Layout;
import FHeader from '../components/header/Header';
import ReviewListings from '../components/reviewContent/reviewListings';
import ReviewUsers from '../components/reviewContent/reviewUsers';
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

  const [selectedKey, setSelectedKey] = React.useState('1');
  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  const renderContent = () => {

    switch (selectedKey) {
      case '1':
        return <ReviewListings status={"pending"} />;
      case '2':
        return <ReviewListings status={"approved"} />;
      case '3':
        return <ReviewListings status={"rejected"} />;
      case '4':
        return <ReviewUsers status={"pending"} />;
      case '5':
        return <ReviewUsers status={"clear"} />;
      case '6':
        return <ReviewUsers status={"banned"} />;
      default:
        return <ReviewListings status={"To review"} />;
    }
  };
  return (
    <Layout style={
        {
            height: '100vh',
        }
    }>
      <FHeader/>
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
              onClick={handleMenuClick}
            />
          </Sider>
          <Content
            style={{
              padding: '0 24px',
                minHeight: '100%',
            }}
            /* Component to load listings/users */
          >
            {renderContent()}
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