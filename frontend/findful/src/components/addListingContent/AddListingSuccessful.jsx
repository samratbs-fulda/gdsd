import React from "react";
import { Space, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const AddListingSuccessful = () => {
  const navigate = useNavigate();

  const navigateToDashboard = () => {
    navigate("/dashboard/landlord");
  };

  return (
    <div>
      <Space align="center">
        <CheckCircleOutlined />
      </Space>
      <p>The submission was submitted successfully. A moderator will review it soon.</p>
      <Button type="primary" onClick={navigateToDashboard}>
        Return to Dashboard
      </Button>
    </div>
  );
};

export default AddListingSuccessful;