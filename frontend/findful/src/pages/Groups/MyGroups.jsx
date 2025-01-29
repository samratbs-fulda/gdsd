// frontend\findful\src\pages\Groups\MyGroups.jsx

import React, { useEffect, useState } from "react";
import { Layout, List, Button, Row, Col, Typography, message } from "antd";
import { TeamOutlined, MessageOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import GroupModal from "../../components/groupModal/groupModal";
import {getGroupsDetailed,acceptInvitation,denyInvitation,leaveGroup,} from "../../services/groups/groupService";
import { useAuth } from "../../services/authContext"; // for current user

const { Content } = Layout;
const { Text } = Typography;

const MyGroups = () => {
  const { user } = useAuth(); 
  const navigate = useNavigate();

  if (!user) {
    return <div>Please log in to manage your groups.</div>;
  }

  const currentUserId = user.id;
  const currentUsername = user ? user.username : "???";

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUserId) {
      loadGroups();
    }
  }, [currentUserId]);

  async function loadGroups() {
    setLoading(true);
    try {
      const allGroups = await getGroupsDetailed(currentUserId);

      const pending = [];
      const joined = [];

      allGroups.forEach((group) => {
        const membership = group.participants.find(
          (p) => p.id === currentUserId
        );
        if (!membership) return;

        if (membership.status === "PENDING") {
          pending.push(group);
        }

        else if (membership.status === "ACCEPTED") {
          joined.push(group);
        }
      });

      setPendingInvites(pending);
      setJoinedGroups(joined);
    } catch (error) {
      message.error("Failed to load groups");
      console.error(error);
    }
    setLoading(false);
  }

  const handleAccept = async (group) => {
    try {
      await acceptInvitation(group.id, currentUserId);
      message.success("Successfully joined the group!");
      loadGroups();
    } catch (error) {
      message.error("Failed to accept invitation.");
    }
  };

  const handleDecline = async (group) => {
    try {
      await denyInvitation(group.id, currentUserId);
      message.success("Invite declined successfully.");
      loadGroups();
    } catch (error) {
      message.error("Failed to decline invitation.");
    }
  };

  const handleLeave = async (group) => {
    try {
      await leaveGroup(group.id, currentUserId);
      message.success("You have left the group.");
      loadGroups();
    } catch (error) {
      message.error("Failed to leave the group.");
    }
  };

  const handleCreateGroup = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    loadGroups(); 
  };

  function getParticipantUsernames(group) {
    return group.participants
      .filter((p) => p.id !== group.creatorId) 
      .map((p) => p.username)
      .join(", ");
  }

  function getCreatorUsername(group) {
    const creator = group.participants.find(
      (p) => p.id === group.creatorId
    );
    return creator?.username || "UnknownUser";
  }

  return (
    <Layout className="page-content-layout">
      <Content
        className="page-inner-content"
        style={{ maxWidth: "1000px", margin: "0 auto" }}
      >
        <Row justify="center" style={{ marginBottom: "20px" }}>
          <Col>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={handleCreateGroup}
            >
              Create Group
            </Button>
          </Col>
        </Row>

        <GroupModal
          isVisible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onClose={closeModal}
          userId={currentUserId}
        />

        <List
          loading={loading}
          header={<h2 style={{ textAlign: "center" }}>Pending Group Invitations</h2>}
          dataSource={pendingInvites}
          locale={{ emptyText: "No pending invites." }}
          style={{ textAlign: "center", marginBottom: "20px" }}
          renderItem={(group) => {
            const participantNames = getParticipantUsernames(group);
            const creatorUsername = getCreatorUsername(group);

            return (
              <List.Item style={{ justifyContent: "center" }}>
                <Row style={{ width: "100%" }} justify="space-between">
                  <Col>
                    <Text strong>
                      <TeamOutlined style={{ marginRight: "8px" }} />
                      Group #{group.id}
                    </Text>
                    <br/>
                    <Text>Participants: {participantNames || "None"}</Text>
                    <br/>
                    <Text>Creator: {creatorUsername}</Text>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      style={{ marginRight: "8px" }}
                      onClick={() => handleAccept(group)}
                    >
                      Accept
                    </Button>
                    <Button danger onClick={() => handleDecline(group)}>
                      Decline
                    </Button>
                  </Col>
                </Row>
              </List.Item>
            );
          }}
        />

        <List
          loading={loading}
          header={<h2 style={{ textAlign: "center" }}>Joined Groups</h2>}
          dataSource={joinedGroups}
          locale={{ emptyText: "You are not in any groups yet." }}
          style={{ textAlign: "center" }}
          renderItem={(group) => {
            const participantNames = getParticipantUsernames(group);
            const creatorUsername = getCreatorUsername(group);

            return (
              <List.Item style={{ justifyContent: "center" }}>
                <Row style={{ width: "100%" }} justify="space-between">
                  <Col>
                    <Text strong>
                      <TeamOutlined style={{ marginRight: "8px" }} />
                      Group #{group.id}
                    </Text>
                    <br/>
                    <Text>Participants: {participantNames || "None"}</Text>
                    <br/>
                    <Text>Creator: {creatorUsername}</Text>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      icon={<MessageOutlined />}
                      style={{ marginRight: 8 }}
                      onClick={() => navigate("/chat")}
                    >
                      Chat
                    </Button>
                    <Button danger onClick={() => handleLeave(group)}>
                      Leave
                    </Button>
                  </Col>
                </Row>
              </List.Item>
            );
          }}
        />
      </Content>
    </Layout>
  );
};

export default MyGroups;
