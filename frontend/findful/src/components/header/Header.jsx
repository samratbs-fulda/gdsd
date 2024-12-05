import React from "react";
import { Layout } from "antd";
const { Header } = Layout;

const FHeader = () => {
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        height: "64px",
      }}
    >
      <p style={{ color: "white" }}>Header content</p>
    </Header>
  );
};

export default FHeader;
