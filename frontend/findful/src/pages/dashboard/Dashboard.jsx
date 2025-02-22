import React, { useState } from 'react';
import "./Dashboard.css";
import { UnorderedListOutlined, UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, Drawer, theme } from 'antd';

const { Content, Sider } = Layout;
import ReviewListings from '../../components/reviewContent/reviewListings';
import ReviewUsers from '../../components/reviewContent/reviewUsers';

const items = [UnorderedListOutlined, UserOutlined].map((icon, index) => {
  if (index === 0) {
    return {
      key: `sub${index + 1}`,
      icon: React.createElement(icon),
      label: `Listings`,
      children: ['Pending', 'Approved', 'Rejected', 'Deleted'].map((label, j) => ({
        key: j + 1,
        label: label,
      })),
    };
  } else {
    return {
      key: `sub${index + 1}`,
      icon: React.createElement(icon),
      label: `Users`,
      children: ['Active', 'Banned', 'Deleted'].map((label, j) => ({
        key: j + 5,
        label: label,
      })),
    };
  }
});

const Dashboard = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedKey, setSelectedKey] = useState('1');
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    if (isMobile) {
      setCollapsed(false); // Close drawer after selection
    }
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
        return <ReviewListings status={"deleted"} />;
      case '5':
        return <ReviewUsers status={"active"} />;
      case '6':
        return <ReviewUsers status={"banned"} />;
      case '7':
        return <ReviewUsers status={"deleted"} />;
    }
  };

  return (
    <Layout
      className="page-content-layout"
      id="dashboard"
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      {isMobile ? (
        <Drawer
          title="Dashboard Menu"
          placement="left"
          closable
          onClose={() => setCollapsed(false)}
          open={collapsed}
        >
          <Menu
            className="dashboard-menu"
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            items={items}
            onClick={handleMenuClick}
          />
        </Drawer>
      ) : (
        <Sider
          className="page-sider"
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="md"
          collapsedWidth={0}
        >
          <Menu
            className="dashboard-menu"
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            items={items}
            onClick={handleMenuClick}
          />
        </Sider>
      )}

      <Layout style={{ 
              minHeight: "100vh",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
         }}>
        {/* Toggle Button for Small Screens */}
        {isMobile && (
          <Button
            className="sider-toggle-btn"
            type="primary"
            onClick={() => setCollapsed(!collapsed)}
            style={{ margin: '16px' }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        )}

        <Content className="page-inner-content">{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
