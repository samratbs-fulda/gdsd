import React from "react";
import "./FindFulFooter.css"
import { Layout, List } from "antd";
const { Footer } = Layout;

const FindFulFooter = () => {
  return (
    <>
      <p>Footer under construction</p>
      <a href="/login">Login</a><br></br>
      <a href="/register">Register</a><br></br>
      <a href="/dashboard">Dashboard</a><br></br>
      <a href="/chat">Chat</a><br></br>
      <a href="/listing/add">Add a listing</a><br></br>
      <a href="/listing/1">View listing details</a><br></br>
      <a href="/profile/1">Edit Profile</a>
    </>
  );
};

export default FindFulFooter;