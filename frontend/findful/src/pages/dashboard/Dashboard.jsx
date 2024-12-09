import React from 'react';
import "./Dashboard.css"
import { UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
const { Content, Sider } = Layout;
import ReviewListings from '../../components/reviewContent/reviewListings';
import ReviewUsers from '../../components/reviewContent/reviewUsers';
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

import { verifyAuth } from '../../services/verifyAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    verifyAuth('MODERATOR')
      .then(() => {
        console.log('Authorized');
      })
      .catch((error) => {
        console.error('Authorization failed:', error.message);
        // redirect to forbidden page
        navigate('/');
      });
  }, [navigate]);

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
        return <ReviewUsers status={"active"} />;
      case '5':
        return <ReviewUsers status={"banned"} />;
      case '6':
        return <ReviewUsers status={"deleted"} />;
    }
  };
  return (
    <Layout className='page-content-layout' id='dashboard'
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Sider className='page-sider' width={200}>
        <Menu className='dashboard-menu'
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Content className='page-inner-content'>
        {renderContent()}
      </Content>
    </Layout> 
  );
};
export default Dashboard;