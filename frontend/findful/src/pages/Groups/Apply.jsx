import React, { useState } from "react";
import {
  Button,
  Radio,
  Card,
  Space,
  Select,
  Form,
  message,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createUserChats } from "../../services/chatService";
import { useAuth } from "../../services/authContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getListingById } from "../../services/listingService";
import GroupModal from "../../components/groupModal/groupModal";
import { getGroupMembers, getGroups } from "../../services/groups/groupService";

const Apply = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user.id;
  let { id } = useParams();

  const listingsQuery = useQuery({
    queryKey: ["listing", id],
    queryFn: () => {
      return getListingById(id);
    },
  });

  const listing = listingsQuery.data || [];

  const groupsQuery = useQuery({
    queryKey: ["groups", userId],
    queryFn: () => {
      return getGroups(userId);
    },
  });

  const groups = groupsQuery.data || [];

  const createChatMutation = useMutation({
    mutationFn: async (groupName) => {
      // add current student as a member
      let memberIds = [user.id];

      if (groupName !== null) {
        // Get all members of the group
        const groupMembers = await getGroupMembers(groupName);
        memberIds = groupMembers.map((member) => member.studentId);
      }

      return createUserChats(listing.id, memberIds);
    },
    onSuccess: (response) => {
      navigate(`/chat/${response.id}`, { state: { chat: response } });
    },
    onError: (error) => {
      console.error("Error creating chat:", error);
    },
  });

  const [applyType, setApplyType] = useState("group");
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const hideModal = () => {
    setIsModalVisible(false);
  };
  const closeModal = () => {
    setIsModalVisible(false);
    groupsQuery.refetch(); // Refetch the groups data
    message.success("Group created successfully!");
    // navigate to chat or group page
  };

  const handleApply = () => {
    if (applyType === "group" && !selectedGroup) {
      message.error("Please select a group to apply as.");
      return;
    }

    createChatMutation.mutate(selectedGroup);
  };

  return (
    <>
      <Card style={{ maxWidth: 600, margin: "50px auto", padding: "20px" }}>
        <Form layout="vertical">
          <Typography.Title
            level={4}
            style={{
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Apply for {listing.title}
          </Typography.Title>

          <Form.Item label="Apply Type">
            <Radio.Group
              onChange={(e) => setApplyType(e.target.value)}
              value={applyType}
            >
              <Space direction="vertical">
                <Radio value="individual">Apply as an individual</Radio>
                <Radio value="group">Apply as a group</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          {applyType === "group" && (
            <Form.Item label="Select a group">
              <Space>
                <Select
                  placeholder="Select a group"
                  style={{ width: 200 }}
                  onChange={(value) => setSelectedGroup(value)}
                >
                  {groups.map((group) => (
                    <Select.Option key={group.id} value={group.name}>
                      {group.name}
                    </Select.Option>
                  ))}
                </Select>
                <Button icon={<PlusOutlined />} onClick={showModal}>
                  Create Group
                </Button>
                <GroupModal
                  isVisible={isModalVisible}
                  onCancel={hideModal}
                  onClose={closeModal}
                  userId={userId}
                />
              </Space>
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" onClick={handleApply} block>
              Apply
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default Apply;
