import React, { useEffect, useState } from "react";

import { Button, Input, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import "./Chat.css"; // Import the CSS file
import { SendOutlined } from "@ant-design/icons";
import io from "socket.io-client";
import { useAuth } from "../../services/authContext";
import { getUserById } from "../../services/login/loginService";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createMessages,
  getMessages,
  getUserChats,
} from "../../services/chatService";
import { useParams, useNavigate } from "react-router-dom";

const socket = io("http://localhost:8000", {
  autoConnect: false,
});

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // socket connection
  const [connected, setConnected] = useState(false);

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const [currentChat, setCurrentChat] = useState(null);

  const userQuery = useQuery({
    queryKey: ["user"],
    enabled: !!user,
    queryFn: () => getUserById(user.id),
  });

  const chatQuery = useQuery({
    queryKey: ["chat"],
    enabled: !!user,
    queryFn: () => getUserChats(user.id),
  });

  console.log("user", userQuery.data);

  const username = userQuery.data?.username;
  const chats = chatQuery.data;

  const updateCurrentChat = (chat) => {
    setCurrentChat(chat);
    navigate(`/chat/${chat.id}`, { replace: true });
  };

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

    socket.on("message", (message) => {
      if (currentChat && currentChat.id === message.chatId) {
        setMessages((messages) => [...messages, message]);
      }
    });

    return () => {
      // Cleanup on component unmount
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, [currentChat]);

  const sendMessage = async () => {
    if (messageInput.trim()) {
      // Check for non-empty message
      try {
        await messageMutation.mutateAsync();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  console.log("current chat", currentChat);

  //get all messages in a current chat
  const messagesQuery = useQuery({
    queryKey: ["messages", { id: currentChat?.id }],
    enabled: !!currentChat,
    queryFn: () => getMessages(currentChat.id),
  });

  const messagesData = messagesQuery.data;
  console.log("user messages", messagesData);

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);
    }
  }, [messagesData]);

  // Mutation to create a new message
  const messageMutation = useMutation({
    mutationKey: ["message", { id: currentChat?.id }],
    mutationFn: () => createMessages(currentChat.id, user.id, messageInput),
    onSuccess: () => {
      socket.emit("message", {
        chatId: currentChat.id,
        senderId: user.id,
        content: messageInput,
        recipientId: currentChat.recipientId,
      });

      // Invalidate and refetch messages after successful mutation
      messagesQuery.refetch();
      setMessageInput(""); // Clear input after successful send
    },
  });

  return (
    <div className="container">
      <Layout style={{ height: "100%" }}>
        <Sider className="chat-sider">
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
          >
            {chats &&
              chats?.map((chat) => (
                <Menu.Item
                  className="chat-menu-item"
                  key={chat.id}
                  onClick={() => updateCurrentChat(chat)}
                >
                  {chat.recipientUsername}
                </Menu.Item>
              ))}
          </Menu>
        </Sider>

        <Layout>
          <Content className="chat-content">
            <div className="chat-title">
              <h3 style={{ margin: 0 }}>{currentChat?.recipientUsername}</h3>
              <div>
                <p>{connected ? "Connected" : "Disconnected"}</p>
                <p>{user ? `Logged in: ${username}` : "Not logged in"}</p>
              </div>
            </div>
            <div className="message-box">
              {!currentChat ? (
                <div className="no-chat-selected">
                  Select a chat to start messaging
                </div>
              ) : (
                messages &&
                messages.map((message, idx) => (
                  <div
                    className={`message-${
                      message.senderId === user.id ? "right" : "left"
                    }`}
                    key={idx}
                  >
                    <div
                      className={`message-bubble-${
                        message.senderId === user.id ? "right" : "left"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))
              )}
            </div>
            {currentChat ? (
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
            ) : null}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Chat;
