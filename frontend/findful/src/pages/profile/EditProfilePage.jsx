import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Button, message, Typography, Layout, Select, Spin } from "antd";
import { getUserProfile, updateUserProfile } from "../../services/profile/profileService";
import { AuthContext } from "../../services/authContext";
import countryList from "../../utils/countryList";
import countryCodes from "../../utils/countryCodes";

const { Content } = Layout;
const { Option } = Select;

const EditProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const userId = id || user?.id;

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (userId) fetchUserProfile(userId);
  }, [userId]);

  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      const userData = await getUserProfile(userId);
      const { countryCode, phoneNumber } = splitPhoneNumber(userData.phone || "+49 1234567");

      form.setFieldsValue({
        ...userData,
        phone: phoneNumber,
        countryCode,
      });
    } catch (error) {
      message.error("Failed to fetch profile information.");
    } finally {
      setLoading(false);
    }
  };

  const handleCountryCodeChange = (value) => {
    form.setFieldsValue({ countryCode: value });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    form.setFieldsValue({ phone: value });

    setPhoneError(value.length < 7 ? "Phone number must have at least seven digits." : "");
  };

  const handleFormSubmit = async (values) => {
    if (!values.phone || values.phone.length < 7) {
      setPhoneError("Phone number must have at least seven digits.");
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(values.countryCode, values.phone);
      const updatedValues = { ...values, phone: formattedPhone };

      await updateUserProfile(userId, updatedValues);
      message.success("Profile updated successfully!");
      fetchUserProfile(userId);
    } catch (error) {
      message.error("Failed to update profile.");
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
        <Typography.Title level={2} style={headingStyle}>
          Edit Profile
        </Typography.Title>

        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Typography.Title level={4}>Personal Information</Typography.Title>
          {renderDisabledField("Username", "username", disabledStyle)}

          <Form.Item label="First Name" name="firstname">
            <Input />
          </Form.Item>

          <Form.Item label="Last Name" name="lastname">
            <Input />
          </Form.Item>
          
          <Form.Item label="Age" name="age" rules={[{ validator: handleAge }]}>
            <Input type="number" min={0} max={120} />
          </Form.Item>

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
              <Form.Item name="countryCode" noStyle>
                <Select style={{ width: "30%" }} onChange={handleCountryCodeChange}>
                {countryCodes.map(({ code, country }) => <Option key={code} value={code}>{`${country} (${code})`}</Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="phone" noStyle>
                <Input style={{ width: "70%" }} placeholder="12345678901" onChange={handlePhoneChange} />
              </Form.Item>
            </Input.Group>
            {phoneError && <span style={{ color: "red" }}>{phoneError}</span>}
          </Form.Item>

          <Typography.Title level={4}>Bio</Typography.Title>
          <Form.Item label="About Me" name="bio">
            <Input.TextArea rows={4} placeholder="Let others know something about you..." />
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
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

const splitPhoneNumber = (phone) => {
  const splitPhone = phone.split(" ");
  return {
    countryCode: splitPhone[0] || "+49",
    phoneNumber: splitPhone.slice(1).join(" ") || "",
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
const headingStyle = { textAlign: "center", marginBottom: "20px" };
