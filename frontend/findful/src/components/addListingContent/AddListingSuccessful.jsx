import React from "react";
import { Layout, Space } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const AddListingSuccessful =  () => {
  return (
    <div>
      <Space align="center">
        <CheckCircleOutlined />
      </Space>
      <p>The submission was submitted successfully. A moderator will review it soon.</p>
    </div>
  );
};

export default AddListingSuccessful;