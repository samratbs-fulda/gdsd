import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Typography, Layout } from "antd";
import { getUserProfile, updateUserProfile } from "../../services/profileService";

const { Content } = Layout;

const EditProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = 1; // Replace with the logged-in user ID
    fetchUserProfile(userId);
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const userData = await getUserProfile(userId);
      setUser(userData);
    } catch (error) {
      message.error("Failed to fetch profile information.");
    }
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const userId = 1; // Replace with the logged-in user ID
      await updateUserProfile(userId, values);
      message.success("Profile updated successfully!");
      fetchUserProfile(userId);
    } catch (error) {
      message.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <Layout className="page-content-layout">
      <Content>
        <Typography.Title level={2}>Edit Profile</Typography.Title>
        <Form
          layout="vertical"
          initialValues={{
            email: user.email,
            phone: user.phone,
            bio: user.bio,
          }}
          onFinish={handleFormSubmit}
        >
          <Typography.Title level={4}>Personal Information</Typography.Title>
          <Form.Item label="Name">
            <Input value={user.firstname + " " + user.lastname} disabled />
          </Form.Item>
          <Form.Item label="Age">
            <Input value={user.age} disabled />
          </Form.Item>
          <Form.Item label="Gender">
            <Input value={user.gender} disabled />
          </Form.Item>
          <Form.Item label="Nationality">
            <Input value={user.nationality} disabled />
          </Form.Item>

          <Typography.Title level={4}>Contact Information</Typography.Title>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Enter a valid phone number" }]}
          >
            <Input />
          </Form.Item>

          <Typography.Title level={4}>Bio</Typography.Title>
          <Form.Item label="About Me" name="bio">
            <Input.TextArea rows={4} placeholder="Let others know something about you..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default EditProfilePage;
