import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  message,
  Typography,
  Layout,
  Select,
  Spin,
} from "antd";
import {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
} from "../../services/profile/profileService";
import { useAuth } from "../../services/authContext";
import countryList from "../../utils/countryList";

import dayjs from "dayjs";
import ProfilePicture from "./ProfilePicture";

const { Content } = Layout;
const { Option } = Select;

const EditProfilePage = () => {
  const { user } = useAuth();

  const { id } = useParams();
  const userId = id || user?.id;

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (userId) fetchUserProfile(userId);
  }, [userId]);

  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      const userData = await getUserProfile(userId);

      const formattedDOB = userData.dob
        ? dayjs(userData.dob).format("YYYY-MM-DD")
        : null;

      form.setFieldsValue({
        ...userData,
        dob: formattedDOB,
      });
    } catch (error) {
      message.error("Failed to fetch profile information.", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (password.length < 6) {
      message.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }

    try {
      await updateUserPassword(userId, password);
      message.success("Password updated successfully.");
      setIsChangingPassword(false);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      message.error("Failed to update password.", error);
    }
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      await updateUserProfile(userId, values);
      message.success("Profile updated successfully!");
      fetchUserProfile(userId);
    } catch (error) {
      message.error("Failed to update profile.", error);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return <Spin tip="Waiting for user ID..." />;
  if (loading) return <Spin tip="Fetching profile data..." />;

  const disabledStyle = { fontWeight: "bold", color: "#000" };

  return (
    <Layout className="page-content-layout" style={layoutStyle}>
      <Content style={contentStyle}>
        <ProfilePicture userId={userId} />

        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Typography.Title level={4}>Change Password</Typography.Title>
          {!isChangingPassword ? (
            <Button type="link" onClick={() => setIsChangingPassword(true)}>
              Change
            </Button>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: "Please enter a new password." },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters.",
                  },
                ]}
              >
                <Input.Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Please confirm your password." },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match.")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <Button
                  type="primary"
                  onClick={handlePasswordChange}
                  disabled={!password || !confirmPassword}
                >
                  Save Password
                </Button>
                <Button onClick={() => setIsChangingPassword(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <Typography.Title level={4}>Personal Information</Typography.Title>
          {renderDisabledField("Username", "username", disabledStyle)}

          <Form.Item label="First Name" name="firstname">
            <Input />
          </Form.Item>

          <Form.Item label="Last Name" name="lastname">
            <Input />
          </Form.Item>

          <Form.Item label="Gender" name="gender">
            <Select>
              {["Male", "Female", "Others"].map((g) => (
                <Option key={g} value={g}>
                  {g}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Nationality" name="nationality">
            <Select showSearch>
              {countryList.map((country) => (
                <Option key={country} value={country}>
                  {country}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Typography.Title level={4}>Contact Information</Typography.Title>
          {renderDisabledField("Email", "email", disabledStyle)}

          <Typography.Title level={4}>Bio</Typography.Title>
          <Form.Item label="About Me" name="bio">
            <Input.TextArea
              rows={4}
              placeholder="Let others know something about you..."
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "50%", marginTop: "50px" }}
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default EditProfilePage;

const renderDisabledField = (label, name, style) => (
  <Form.Item label={label} name={name}>
    <Input disabled style={style} />
  </Form.Item>
);

const layoutStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const contentStyle = {
  width: "50%",
  minWidth: "400px",
  maxWidth: "800px",
  padding: "20px",
  background: "#fff",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
};
