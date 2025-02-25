import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, message, Typography, Layout, Select, Spin, Col, Row, Flex } from "antd";
import { getUserProfile, updateUserProfile, updateUserPassword } from "../../services/profile/profileService";
import { useAuth } from "../../services/authContext";
import countryList from "../../utils/countryList";
import countryCodes from "../../utils/countryCodes";
import dayjs from "dayjs";
import ProfilePicture from "./ProfilePicture";
import { updateUserStatus } from "../../services/reviewContent/reviewUserService";
import Paragraph from "antd/es/typography/Paragraph";


const { Content } = Layout;
const { Option } = Select;

const EditProfilePage = () => {
  const { user } = useAuth();
  const role = user.role;
  const { id } = useParams();
  const userId = id || user?.id;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isEditingDOB, setIsEditingDOB] = useState(false);
  const [selectedDOB, setSelectedDOB] = useState(null); 
  const [form] = Form.useForm();
  const [phoneError, setPhoneError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDOB] = useState(null);

  useEffect(() => {
    if (userId) fetchUserProfile(userId);
  }, [userId]);

  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      const userData = await getUserProfile(userId);

      const dob = userData.dob ? dayjs(userData.dob).format("YYYY-MM-DD") : ""; 
      const { countryCode, phoneNumber } = splitPhoneNumber(userData.phone || "+49 1234567");

      form.setFieldsValue({
        ...userData,
        dob,
        phone: phoneNumber,
        countryCode: countryCode || "+49",
      });

      setSelectedDOB(null); 
    } catch (error) {
      message.error("Failed to fetch profile information.");
    } finally {
      setLoading(false);
    }
  };

  const handleDOBChange = (e) => {
    setDOB(e.target.value);
  };

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const birthDate = dayjs(dob);
    const today = dayjs();
    return today.diff(birthDate, "year");
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
        message.error("Failed to update password.");
    }
};


  const handleFormSubmit = async (values) => {
    if (!values.phone || values.phone.length < 7) {
      setPhoneError("Phone number must have at least seven digits.");
      return;
    }

    if (!dob) {
        message.error("Please enter your Date of Birth");
        return;
    }


    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(values.countryCode, values.phone);
      const updatedValues = { ...values, phone: formattedPhone, dob };

      await updateUserProfile(userId, updatedValues);
      message.success("Profile updated successfully!");
      setSelectedDOB(dob);
      form.setFieldsValue({
        ...values,
        dob,
        age: calculateAge(dob), 
      });
    } catch (error) {
      message.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDOBEdit = () => {
    setIsEditingDOB(!isEditingDOB); 
  };

  if (!userId) return <Spin tip="Waiting for user ID..." />;
  if (loading) return <Spin tip="Fetching profile data..." />;

  const disabledStyle = { fontWeight: "bold", color: "#000" };

  return (
    <Layout className="page-content-layout" style={layoutStyle}>
      <Content style={contentStyle}>

        <ProfilePicture userId={userId} />

        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Typography.Title level={4}>Personal Information</Typography.Title>
          {renderDisabledField("Username", "username", disabledStyle)}

          <Form.Item label="First Name" name="firstname">
            <Input />
          </Form.Item>

          <Form.Item label="Last Name" name="lastname">
            <Input />
          </Form.Item>

          <Typography.Title level={4}>Change Password</Typography.Title>
            {!isChangingPassword ? (
                <Button type="link" onClick={() => setIsChangingPassword(true)}>Change</Button>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[{ required: true, message: "Please enter a new password." }, { min: 6, message: "Password must be at least 6 characters." }]}
                    >
                        <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
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
                                    return Promise.reject(new Error("Passwords do not match."));
                                },
                            }),
                        ]}
                    >
                        <Input.Password value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </Form.Item>

                    <div style={{ display: "flex", justifyContent: "space-between" }}> 
                        <Button type="primary" onClick={handlePasswordChange} disabled={!password || !confirmPassword}>
                            Save Password
                        </Button>
                        <Button onClick={() => setIsChangingPassword(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

          <Form.Item label="Age" name="age">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Input
                disabled
                style={disabledStyle}
                value={selectedDOB ? calculateAge(selectedDOB) : form.getFieldValue("age")}
              />
              <Button type="link" onClick={toggleDOBEdit}>
                {isEditingDOB ? "Cancel" : "Change"}
              </Button>
            </div>
          </Form.Item>

          {isEditingDOB && (
            <Form.Item name="dob">
              <input
                type="date"
                onChange={handleDOBChange}
                value={selectedDOB || form.getFieldValue("dob") || ""}
                style={{ width: "100%", padding: "8px" }}
              />
            </Form.Item>
          )}

          <Form.Item label="Gender" name="gender">
            <Select>{["Male", "Female", "Others"].map((g) => <Option key={g} value={g}>{g}</Option>)}</Select>
          </Form.Item>

          <Form.Item label="Nationality" name="nationality">
            <Select showSearch>
              {countryList.map((country) => <Option key={country} value={country}>{country}</Option>)}
            </Select>
          </Form.Item>
          

          <Typography.Title level={4}>Contact Information</Typography.Title>
          {renderDisabledField("Email", "email", disabledStyle)}

          <Form.Item label="Phone Number">
            <Input.Group compact>
              <Form.Item name="countryCode" initialValue="+49" noStyle>
                <Select style={{ width: "30%" }} value={form.getFieldValue("countryCode") || "+49"} onChange={(value) => form.setFieldsValue({ countryCode: value })}>
                  {countryCodes.map(({ code, country }) => (<Option key={code} value={code}>{`${country} (${code})`}</Option>))}
                </Select>
              </Form.Item>
              <Form.Item name="phone" noStyle>
                <Input style={{ width: "70%" }} placeholder="12345678901" />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Typography.Title level={4}>Bio</Typography.Title>
          <Form.Item label="About Me" name="bio">
            <Input.TextArea rows={4} placeholder="Let others know something about you..." />
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Flex justify="center">
              <Paragraph style={{ width: "100%" }}>
                <Row justify={"center"}>
                  {role === "MODERATOR" && (
                    <>
                    <Col lg={2} xs={4}>
                      <Button
                        key="ban"
                        type="primary"
                        style={{ width: "100%", marginTop: "20px" }}
                        onClick={async () => {
                          await updateUserStatus(parseInt(id), "BANNED");
                          message.success("User deleted successfully");
                          navigate("/dashboard");
                        }}
                      >
                        Ban
                      </Button>
                    </Col>
                    <Col lg={2} xs={4} offset={1}>
                      <Button
                        key="delete"
                        type="primary"
                        style={{ width: "100%", marginTop: "20px" }}
                        onClick={async () => {
                          await updateUserStatus(parseInt(id), "DELETED");
                          message.success("User deleted successfully");
                          navigate("/dashboard");
                        }}
                      >
                        Delete
                      </Button>
                    </Col>
                  </>
            )}
                </Row>
              </Paragraph>
            </Flex>
              <Button type="primary" htmlType="submit" loading={loading} style={{ width: "50%" }}>
                Save Changes
              </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default EditProfilePage;

const splitPhoneNumber = (phone = "+49") => {
  const splitPhone = phone.split(" ");
  return {
    countryCode: splitPhone[0] || "+49",
    phoneNumber: splitPhone[1] || "",
  };
};



const formatPhoneNumber = (countryCode, phone) => `${countryCode} ${phone.replace(/^\+\d+\s*/, "")}`;

const renderDisabledField = (label, name, style) => (
  <Form.Item label={label} name={name}>
    <Input disabled style={style} />
  </Form.Item>
);

const layoutStyle = { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" };
const contentStyle = { width: "50%", minWidth: "400px", maxWidth: "800px", padding: "20px", background: "#fff", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" };
