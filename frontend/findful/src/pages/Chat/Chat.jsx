import Header from "../../components/header/Header";

import React, { useEffect, useState } from "react";

import { Button, Input, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import "./Chat.css"; // Import the CSS file
import { SendOutlined } from "@ant-design/icons";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const dummyChats = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
    { id: 4, name: "Bob Brown" },
    { id: 5, name: "Charlie Green" },
  ];

  // const messages = [
  //   {
  //     id: 1,
  //     text: "Hello, I like the apartment location and would like to rent it.",
  //     sender: "left",
  //   },
  //   { id: 2, text: "Sounds good!", sender: "right" },
  //   { id: 3, text: "What are you up to today?", sender: "left" },
  //   { id: 4, text: "Just working on some projects.", sender: "right" },
  // ];
  useEffect(() => {
    // Socket.IO event listeners

    // Listen for incoming messages
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });

    return () => {
      // Cleanup on component unmount
      socket.off("message");
    };
  }, [messages]);

  const sendMessage = () => {
    if (messageInput) {
      const message = { text: messageInput, timestamp: new Date() };
      socket.emit("message", message);
      setMessageInput("");
    }
  };

  return (
    <div className="container">
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
                <div className={`message-left`} key={message.id}>
                  <div className={`message-bubble-left`}>{message.text}</div>
                </div>
              ))}
            </div>
            <div className="input-area">
              <Input
                placeholder="Type a message..."
                className="input-field"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={sendMessage}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Chat;
