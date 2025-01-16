import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Button, message, Typography, Layout } from "antd";
import { getUserProfile, updateUserProfile } from "../../services/profile/profileService";
import { AuthContext } from "../../services/authContext"; 

const { Content } = Layout;

const EditProfilePage = () => {
  const { user } = useContext(AuthContext); 
  const { id } = useParams(); 

  const userId = id || user?.id; 

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
    }
  }, [userId]);

  const fetchUserProfile = async (userId) => {
    try {
      const userData = await getUserProfile(userId);
      setUserProfile(userData);
    } catch (error) {
      // message.error("Failed to fetch profile information.");
      const userData = {
        firstname: "",
        lastname: "",
        age: 0,
        nationality: "",
        email: "",
        phone: "",
        description: "",
      }
      setUserProfile(userData);
    }
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      await updateUserProfile(userId, values);
      message.success("Profile updated successfully!");
      fetchUserProfile(userId);
    } catch (error) {
      message.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) {
    return <p>`</p>;
  }

  return (
    <Layout className="page-content-layout">
      <Content>
        <Typography.Title level={2}>Edit Profile</Typography.Title>
        <Form
          layout="vertical"
          initialValues={{
            email: userProfile.email,
            phone: userProfile.phone,
            bio: userProfile.bio,
          }}
          onFinish={handleFormSubmit}
        >
          <Typography.Title level={4}>Personal Information</Typography.Title>
          <Form.Item label="Name">
            <Input value={`${userProfile.firstname} ${userProfile.lastname}`} />
          </Form.Item>
          <Form.Item label="Age">
            <Input value={userProfile.age} />
          </Form.Item>
          <Form.Item label="Gender">
            <Input value={userProfile.gender} />
          </Form.Item>
          <Form.Item label="Nationality">
            <Input value={userProfile.nationality} />
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
