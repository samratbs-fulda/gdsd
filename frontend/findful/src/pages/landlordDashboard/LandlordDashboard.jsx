import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button, Drawer, Layout, Menu, theme } from 'antd';

const { Content, Sider } = Layout;
import ReviewListings from '../../components/reviewContent/reviewListings';
import AddListing from '../AddListing/AddListing';
import { useNavigate } from 'react-router-dom';

const items = [UnorderedListOutlined, UnorderedListOutlined].map((icon, index) => {
  if (index === 0) {
    return {
      key: `sub${index + 1}`,
      icon: React.createElement(icon),
      label: `Listings`,
      children: ['Pending', 'Approved', 'Rejected', 'Deleted'].map((label, j) => {
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
      label: `Manage listing`,
      children: ['Add'].map((label, j) => {
        return {
          key: j + 5,
          label: label,
        };
      }),
    };
  }
});

const LandlordDashboard = () => {
  const navigate = useNavigate();
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
        navigate("/listing/add");
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

export default LandlordDashboard;