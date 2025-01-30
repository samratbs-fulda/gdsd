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
import { useNavigate, useLocation } from "react-router-dom";
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

  console.log("participants", chats, currentChat);

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
      console.log("HHHHH", message);
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
    console.log("Updating current chat:", chat);
    setCurrentChat(chat);
    navigate(`/chat/${chat.id}`, { replace: true });
  };
  // Send Message Mutation
  const messageMutation = useMutation({
    mutationKey: ["message", { id: currentChat?.id }],
    mutationFn: () => createMessages(currentChat.id, user.id, messageInput),
    onSuccess: () => {
      const recipients = currentChat.participants.filter(
        (p) => p.id !== user.id
      );
      console.log(recipients);
      recipients.forEach((recipient) => {
        socket.emit("message", {
          chatId: currentChat.id,
          senderId: user.id,
          content: messageInput,
          recipientId: recipient.id,
        });
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

  const getMessageSenderName = (senderId, participants) => {
    if (!participants) return "";
    const sender = participants.find((p) => p.id === senderId);
    return sender ? sender.username : "";
  };

  const getLandlordChatTitle = (landlordId, participants) => {
    const title = participants
      .filter((p) => p.id !== landlordId)
      .map((p) => p.username)
      .join(", ");
    return title;
  };

  return (
    <div className="container">
      <Layout style={{ height: "100%" }}>
        <Sider className="chat-sider">
          <div className="chat-title">
            <h3 style={{ margin: 0 }}>Conversations</h3>
          </div>
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
                  {user?.role === "LANDLORD"
                    ? getLandlordChatTitle(user.id, chat.participants)
                    : chat?.listing.title}
                </Menu.Item>
              ))}
          </Menu>
        </Sider>

        <Layout>
          <Content className="chat-content">
            {currentChat && (
              <div className="chat-title">
                <h3 style={{ margin: 0 }}>
                  {user?.role === "LANDLORD"
                    ? getLandlordChatTitle(user.id, currentChat.participants)
                    : currentChat?.listing.title}
                </h3>
                <div>
                  <p>{connected ? "Connected" : "Disconnected"}</p>
                  <p>{user ? `Logged in: ${username} ` : "Not logged in"}</p>
                </div>
              </div>
            )}
            {/* Add participants bar */}
            {currentChat?.participants && (
              <div className="participants-bar">
                <span className="participant-title">Participants: </span>
                {currentChat.participants.map((p) => (
                  <span key={p.id} className="participant">
                    {p.username}
                  </span>
                ))}
              </div>
            )}
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
                        <div className="message-username">{`sent by ${getMessageSenderName(
                          message.senderId,
                          currentChat.participants
                        )}`}</div>
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
