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
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getEnvironment } from "../../utils/fetchEnvironment";

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

const socket = io(`${apiUrl}`, {
  autoConnect: false,
});

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [currentChat, setCurrentChat] = useState(null);

  // Users and chats queries
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

  const username = userQuery.data?.username;
  const chats = chatQuery.data;

  // Sync current chat from location state
  useEffect(() => {
    if (location.state?.chat && chatQuery.data) {
      const currentChat = chatQuery.data.find(
        (c) => c.id === location.state.chat.id
      );
      setCurrentChat(currentChat);
    }
  }, [location.state, chatQuery.data]);

  //Messages Query
  const messagesQuery = useQuery({
    queryKey: ["messages", { id: currentChat?.id }],
    enabled: !!currentChat,
    queryFn: () => getMessages(currentChat.id),
  });

  const messagesData = messagesQuery.data;

  // update messages on query completion
  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);
    }
  }, [messagesData]);

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

  // Update Current Chat
  const updateCurrentChat = (chat) => {
    setCurrentChat(chat);
    navigate(`/chat/${chat.id}`, { replace: true });
  };
  // Send Message Mutation
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

  // Send message Handler
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

  return (
    <div className="container">
      <Layout style={{ height: "100%" }}>
        <Sider className="chat-sider">
          <Menu
            mode="inline"
            selectedKeys={[currentChat ? currentChat.id.toString() : ""]}
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
              <h3 style={{ margin: 0 }}>
                {user?.role === "LANDLORD"
                  ? currentChat?.recipientUsername
                  : currentChat?.listing.title}
              </h3>
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
                      {message.senderId !== user.id ? (
                        <div className="message-username">{`sent by ${currentChat?.recipientUsername}`}</div>
                      ) : null}
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
