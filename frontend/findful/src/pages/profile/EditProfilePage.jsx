import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Button, message, Typography, Layout, Select, Spin } from "antd";
import { getUserProfile, updateUserProfile } from "../../services/profile/profileService";
import { AuthContext } from "../../services/authContext";
import countryList from "../../utils/countryList";
import countryCodes from "../../utils/countryCodes";
import dayjs from "dayjs";
import ProfilePicture from "./ProfilePicture";


const { Content } = Layout;
const { Option } = Select;

const EditProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const userId = id || user?.id;

  const [loading, setLoading] = useState(false);
  const [isEditingDOB, setIsEditingDOB] = useState(false); 
  const [loadingAge, setLoadingAge] = useState(false);
  const [form] = Form.useForm();
  const [phoneError, setPhoneError] = useState("");

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
    } catch (error) {
      message.error("Failed to fetch profile information.");
    } finally {
      setLoading(false);
    }
  };

  const handleDOBChange = async (e) => {
    const dob = e.target.value;
    setLoadingAge(true);

    setTimeout(async () => {
      const calculatedAge = calculateAge(dob);

      form.setFieldsValue({ dob, age: calculatedAge });

      try {
        await updateUserProfile(userId, { dob, age: calculatedAge });
        message.success("Date of Birth updated successfully!");
        setIsEditingDOB(false); 
      } catch (error) {
        message.error("Failed to update Date of Birth.");
      } finally {
        setLoadingAge(false); 
      }
    }, 500);
  };

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = dayjs(dob);
    const today = dayjs();
    return today.diff(birthDate, "year"); 
  };

  const handleFormSubmit = async (values) => {
    if (!values.phone || values.phone.length < 7) {
      setPhoneError("Phone number must have at least seven digits.");
      return;
    }

    const dob = values.dob ? dayjs(values.dob) : null;
    const calculatedAge = calculateAge(values.dob);

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(values.countryCode, values.phone);
      const updatedValues = { ...values, phone: formattedPhone, age: calculatedAge };

      await updateUserProfile(userId, updatedValues);
      message.success("Profile updated successfully!");
      fetchUserProfile(userId);
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

          <Form.Item label="Age" name="age">
            {!isEditingDOB ? (
              <>
                {loadingAge ? (
                  <Spin /> 
                ) : (
                  <Input disabled style={disabledStyle} value={form.getFieldValue("age")} />
                )}
                <Button type="link" onClick={toggleDOBEdit}>Edit Age</Button>
              </>
            ) : (
              <input
                type="date"
                onBlur={handleDOBChange}
                value={form.getFieldValue("dob") || ""}
                style={{ width: "100%", padding: "8px" }}
              />
            )}
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
const headingStyle = { textAlign: "center", marginBottom: "20px" };
