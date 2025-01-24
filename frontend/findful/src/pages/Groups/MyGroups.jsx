import React, { useState } from "react";
import { Layout, List, Button, Row, Col, Typography } from "antd";
import { TeamOutlined, MessageOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import GroupModal from "../../components/groupModal/groupModal";

const { Content } = Layout;
const { Text } = Typography;

const MyGroups = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const groupRequests = [
    { groupId: 1, name: "Study Group", creator: "Alice" },
    { groupId: 2, name: "Coding Club", creator: "Charlie" },
  ];

  const groups = [
    { groupId: 3, name: "Research Team", creator: "Eve" },
  ];

  return (
    <Layout className="page-content-layout" style={{ display: "flex", justifyContent: "center" }}>
      <Content 
        className="page-inner-content" 
        style={{ width: "50%", minWidth: "600px", maxWidth: "1200px", margin: "0 auto" }}
      >

        <Row justify="center" style={{ marginBottom: "20px" }}>
          {/*<Button icon={<PlusOutlined />} type="primary" onClick={() => setIsModalVisible(true)}>
            New Group
          </Button>*/}
        </Row>

        <GroupModal isVisible={isModalVisible} onCancel={() => setIsModalVisible(false)} onClose={() => setIsModalVisible(false)} />

        <List
          header={<h2 style={{ textAlign: "center" }}>Pending Group Invitations</h2>}
          dataSource={groupRequests}
          locale={{ emptyText: "No pending invites." }}
          style={{ textAlign: "center" }}
          renderItem={(group) => (
            <List.Item style={{ justifyContent: "center" }}>
              <Row style={{ width: "100%" }} justify="space-between">
                <Col>
                  <TeamOutlined style={{ marginRight: "8px" }} />
                  <Text strong>{group.name}</Text> <Text type="secondary">(Creator: {group.creator})</Text>
                </Col>
                <Col>
                  <Button type="primary" style={{ marginRight: "8px" }}>Accept</Button>
                  <Button danger>Decline</Button>
                </Col>
              </Row>
            </List.Item>
          )}
        />

        <List
          header={<h2 style={{ textAlign: "center" }}>Joined Groups</h2>}
          dataSource={groups}
          locale={{ emptyText: "You are not part of any groups yet." }}
          style={{ textAlign: "center" }}
          renderItem={(group) => (
            <List.Item style={{ justifyContent: "center" }}>
              <Row style={{ width: "100%" }} justify="space-between">
                <Col>
                  <TeamOutlined style={{ marginRight: "8px" }} />
                  <Text strong>{group.name}</Text> <Text type="secondary">(Creator: {group.creator})</Text>
                </Col>
                <Col>
                  <Button type="primary" icon={<MessageOutlined />} style={{ marginRight: "8px" }}>Chat</Button>
                  <Button danger>Leave</Button>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </Content>
    </Layout>
  );
};

export default MyGroups;
