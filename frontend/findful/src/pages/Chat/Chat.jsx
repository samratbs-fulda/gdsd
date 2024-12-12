import React, { useEffect, useState } from "react";

import { Button, Input, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import "./Chat.css"; // Import the CSS file
import { SendOutlined } from "@ant-design/icons";
import io from "socket.io-client";
import { useAuth } from "../../services/authContext";
import { getUserById } from "../../services/login/loginService";
import { useQuery } from "@tanstack/react-query";

const socket = io("http://localhost:8000", {
  autoConnect: false,
});

const Chat = () => {
  const { user } = useAuth();

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const userQuery = useQuery({
    queryKey: ["user"],
    enabled: !!user,
    queryFn: () => getUserById(user.id),
  });

  console.log(userQuery.data);

  const username = userQuery.data?.username;

  const dummyChats = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
    { id: 4, name: "Bob Brown" },
    { id: 5, name: "Charlie Green" },
  ];

  const connectSocket = () => {
    const token = localStorage.getItem("token");

    if (token) {
      socket.auth = { token };
      socket.connect();
    }
  };

  // Connect to Socket.IO server on component mount
  useEffect(() => {
    connectSocket();

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    // Listen for incoming messages
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      // Cleanup on component unmount
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (messageInput) {
      const message = {
        text: messageInput,
        timestamp: new Date(),
        sender: user.id,
      };
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
              <div>
                <p>{connected ? "Connected" : "Disconnected"}</p>
                <p>{user ? username : "Not logged in"}</p>
              </div>
            </div>
            <div className="message-box">
              {messages.map((message, idx) => (
                <div
                  className={`message-${
                    message.sender === user.id ? "right" : "left"
                  }`}
                  key={idx}
                >
                  <div
                    className={`message-bubble-${
                      message.sender === user.id ? "right" : "left"
                    }`}
                  >
                    {message.text}
                  </div>
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
