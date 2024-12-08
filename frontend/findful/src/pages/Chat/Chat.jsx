import React from "react";
import Header from "../../components/header/FindFulHeader";
import { Button, Input, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import "./Chat.css"; // Import the CSS file
import { SendOutlined } from "@ant-design/icons";

const Chat = () => {
  const dummyChats = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
    { id: 4, name: "Bob Brown" },
    { id: 5, name: "Charlie Green" },
  ];

  const messages = [
    {
      id: 1,
      text: "Hello, I like the apartment location and would like to rent it.",
      sender: "left",
    },
    { id: 2, text: "Sounds good!", sender: "right" },
    { id: 3, text: "What are you up to today?", sender: "left" },
    { id: 4, text: "Just working on some projects.", sender: "right" },
  ];

  return (
    <div className="container">
      <Header />
      <Layout style={{ height: "calc(100vh - 64px)" }}>
        <Sider className="chat-sider">
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
          >
            {dummyChats.map((chat) => (
              <Menu.Item className="chat-menu-item" key={chat.id}>
                {chat.name}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>

        <Layout>
          <Content className="chat-content">
            <div className="chat-title">
              <h3 style={{ margin: 0 }}>3-room shared bedroom apartment</h3>
            </div>
            <div className="message-box">
              {messages.map((message) => (
                <div className={`message-${message.sender}`} key={message.id}>
                  <div className={`message-bubble-${message.sender}`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="input-area">
              <Input placeholder="Type a message..." className="input-field" />
              <Button type="primary" icon={<SendOutlined />} />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Chat;
