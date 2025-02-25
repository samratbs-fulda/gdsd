import React, { useState } from "react";
import { Layout, List, Button, Row, Col, Typography, message } from "antd";
import { TeamOutlined, MessageOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import GroupModal from "../../components/groupModal/groupModal";
import {getGroupsDetailed,acceptInvitation,denyInvitation,leaveGroup,} from "../../services/groups/groupService";
import { useAuth } from "../../services/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const { Content } = Layout;
const { Text } = Typography;

const MyGroups = () => {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    data: allGroups,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allGroups", currentUserId],
    queryFn: () => getGroupsDetailed(currentUserId),
    enabled: !!currentUserId,
  });

  const acceptInvitationMutation = useMutation({
    mutationFn: ({ groupId, userId }) => acceptInvitation(groupId, userId),
    onSuccess: () => {
      message.success("Successfully joined the group!");
      queryClient.invalidateQueries(["allGroups", currentUserId]);
    },
    onError: () => {
      message.error("Failed to accept invitation.");
    },
  });

  const handleAccept = (group) => {
    acceptInvitationMutation.mutate({ groupId: group.id, userId: currentUserId });
  };

  const denyInvitationMutation = useMutation({
    mutationFn: ({ groupId, userId }) => denyInvitation(groupId, userId),
    onSuccess: () => {
      message.success("Invite declined successfully.");
      queryClient.invalidateQueries(["allGroups", currentUserId]);
    },
    onError: () => {
      message.error("Failed to decline invitation.");
    },
  });

  const handleDecline = (group) => {
    denyInvitationMutation.mutate({ groupId: group.id, userId: currentUserId });
  };

  const leaveGroupMutation = useMutation({
    mutationFn: ({ groupId, userId }) => leaveGroup(groupId, userId),
    onSuccess: () => {
      message.success("You have left the group.");
      queryClient.invalidateQueries(["allGroups", currentUserId]);
    },
    onError: () => {
      message.error("Failed to leave the group.");
    },
  });

  const handleLeave = (group) => {
    leaveGroupMutation.mutate({ groupId: group.id, userId: currentUserId });
  };

  let pendingInvites = [];
  let joinedGroups = [];

  if (allGroups) {
    allGroups.forEach((group) => {
      const membership = group.participants.find((p) => p.id === currentUserId);
      if (!membership) return;

      if (membership.status === "PENDING") {
        pendingInvites.push(group);
      } else if (membership.status === "ACCEPTED") {
        joinedGroups.push(group);
      }
    });
  }

  if (!currentUserId) {
    return <div>Please log in to manage your groups.</div>;
  }

  if (isLoading) return <div>Loading groups...</div>;
  if (error) return <div>Failed to load groups: {error.message}</div>;


  function getParticipantUsernames(group) {
    return group.participants
      .filter((p) => p.id !== group.creatorId)
      .map((p) => p.username)
      .join(", ");
  }

  function getCreatorUsername(group) {
    const creator = group.participants.find((p) => p.id === group.creatorId);
    return creator?.username || "UnknownUser";
  }

  const closeModal = () => {
    setIsModalVisible(false);
    queryClient.invalidateQueries(["allGroups", currentUserId]);
  };

  return (
    <Layout className="page-content-layout">
      <Content className="page-inner-content" style={{ maxWidth: 900, margin: "0 auto" }}>
        <Row justify="center" style={{ marginBottom: 20 }}>
          <Col>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setIsModalVisible(true)}
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

        {/* Pending Invites */}
        <List
          header={<h2 style={{ textAlign: "center" }}>Pending Group Invitations</h2>}
          dataSource={pendingInvites}
          locale={{ emptyText: "No pending invites." }}
          style={{ textAlign: "center", marginBottom: "20px" }}
          renderItem={(group) => {
            const participantNames = getParticipantUsernames(group);
            const creatorUsername = getCreatorUsername(group);

            return (
              <List.Item style={{ justifyContent: "center" }}>
                <Row style={{ width: "100%" }} justify="space-between" align="middle">
                  <Col span={18}>
                    <Text strong>
                      <TeamOutlined style={{ marginRight: 8 }} />
                      Group #{group.id}
                    </Text>
                    <br/>
                    <Text>Participants: {participantNames || "None"}</Text>
                    <br/>
                    <Text>Creator: {creatorUsername}</Text>
                  </Col>
                  <Col span={6} style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <Button
                      type="primary"
                      style={{ minWidth: "90px" }} 
                      onClick={() => handleAccept(group)}
                    >
                      Accept
                    </Button>
                    <Button danger style={{ minWidth: "90px" }} onClick={() => handleDecline(group)}>
                      Decline
                    </Button>
                  </Col>

                </Row>
              </List.Item>
            );
          }}
        />

        {/* Joined Groups */}
        <List
          header={<h2 style={{ textAlign: "center" }}>Joined Groups</h2>}
          dataSource={joinedGroups}
          locale={{ emptyText: "You are not in any groups yet." }}
          style={{ textAlign: "center" }}
          renderItem={(group) => {
            const participantNames = getParticipantUsernames(group);
            const creatorUsername = getCreatorUsername(group);

            return (
              <List.Item style={{ justifyContent: "space-between" }}>
                <Row style={{ width: "100%" }} justify="space-between" align="middle">
                  <Col span={18}>
                    <Text strong>
                      <TeamOutlined style={{ marginRight: 8 }} />
                      Group #{group.id}
                    </Text>
                    <br/>
                    <Text>Participants: {participantNames || "None"}</Text>
                    <br/>
                    <Text>Creator: {creatorUsername}</Text>
                  </Col>
                  <Col span={6} style={{ textAlign: "right" }}>
                  {/*<Button
                      type="primary"
                      icon={<MessageOutlined />}
                      style={{ marginRight: 8 }}
                      onClick={() => navigate("/chat")}
                    >
                      Chat
                    </Button> */}
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
