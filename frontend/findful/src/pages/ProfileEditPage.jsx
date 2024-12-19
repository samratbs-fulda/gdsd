import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, message } from "antd";

const ProfileEditPage = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/profile/${id}`);
        form.setFieldsValue(response.data);
      } catch (error) {
        message.error("Error fetching profile");
      }
    };

    fetchProfile();
  }, [id, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.put(`/profile/${id}`, values);
      message.success("Profile updated successfully");
    } catch (error) {
      message.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h1>Edit Profile</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="age" label="Age" rules={[{ required: true, message: "Age is required" }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Gender is required" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="nationality" label="Nationality">
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Phone is required" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="bio" label="Bio">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

export default ProfileEditPage;
