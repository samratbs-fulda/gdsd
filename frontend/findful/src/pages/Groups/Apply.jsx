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
import { getListingById } from '../../services/listingService';
import GroupModal from '../../components/groupModal/groupModal';

const Apply = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  let { id } = useParams();

  const listingsQuery = useQuery({
    queryKey: ["listing", id],
    queryFn: () => {
      return getListingById(id);
    },
  });

  const listing = listingsQuery.data || [];
  console.log(listing);

  const createChatMutation = useMutation({
    mutationFn: (listingId) => {
      console.log("Mutation: Creating chat between", listingId);
      return createUserChats(listingId, [user.id]);
    },
    onSuccess: (response) => {
      navigate(`/chat/${response.id}`, { state: { chat: response } });
    },
    onError: (error) => {
      console.error("Error creating chat:", error);
    },
  });

  const sendMessage = (listingId) => {
    if (!user || !listingId) {
      console.error("Missing user or landlord information");
      return;
    }
    console.log(
      "SendMessage: Creating chat between",
      user.id,
      "and",
      listingId
    );
    createChatMutation.mutate(listingId);
  };

  const [applyType, setApplyType] = useState("group");
  const [selectedGroup, setSelectedGroup] = useState(null);


  const createNewGroup = () => {
    message.success("Group created successfully!");
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const hideModal = () => {
    setIsModalVisible(false);
  };
  const closeModal = () => {
    setIsModalVisible(false);
    message.success('Group created successfully!');
    // navigate to chat or group page
  };

  const handleApply = () => {
    if (applyType === "individual") {
      sendMessage(listing?.id);
    }
    if (applyType === "group" && !selectedGroup) {
      message.error("Please select a group to apply as.");
      return;
    }
    //some call here to create a group
    message.success("Application submitted successfully!");
  };

  //needs to be polluted by values from backend if available.
  const groups = [
    { id: 1, name: "Example Group A" },
    { id: 2, name: "Example Group B" },
    { id: 3, name: "Example Group C" },
  ];

  return (
    <>
    <Card style={{ maxWidth: 600, margin: '50px auto', padding: '20px' }}>
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
              <Button icon={<PlusOutlined />} onClick={showModal}>Create Group</Button>
              <GroupModal isVisible={isModalVisible} onCancel={hideModal} onClose={closeModal} />
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
