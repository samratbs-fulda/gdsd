import React from 'react';
import { UnorderedListOutlined} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
const { Content, Sider } = Layout;
import ReviewListings from '../../components/reviewContent/reviewListings';
import AddListing from '../AddListing/AddListing';
// import EditListing from '../AddListing/EditListing';

const items = [UnorderedListOutlined, UnorderedListOutlined].map((icon, index) => {
  if (index === 0) {
    return {
      key: `sub${index + 1}`,
      icon: React.createElement(icon),
      label: `Listings`,
      children: ['On Review', 'Approved', 'Rejected', 'Deleted'].map((label, j) => {
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
      children: ['Add', 'Edit'].map((label, j) => {
        return {
          key: j + 5,
          label: label,
        };
      }),
    };
  }
});

const LandlordDashboard = () => {
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
        return <ReviewListings status={"deleted"} />;
      case '5':
        return <AddListing />;
      case '6':
        // return <EditListing listingId={12}/>;
        break;
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
export default LandlordDashboard;