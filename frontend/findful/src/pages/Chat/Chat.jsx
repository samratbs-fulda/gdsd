import React, { useEffect, useState, forwardRef } from "react";

import { Button, Input, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import "./Chat.css"; // Import the CSS file
import { MenuOutlined, SendOutlined } from "@ant-design/icons";
import io from "socket.io-client";
import { useAuth } from "../../services/authContext";
import { getUserById } from "../../services/login/loginService";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createMessages,
  getMessages,
  getUserChats,
} from "../../services/chatService";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getEnvironment } from "../../utils/fetchEnvironment";

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

const socket = io(`${apiUrl}`, {
  autoConnect: false,
});

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

const ChatSider = ({
  chats,
  currentChat,
  updateCurrentChat,
  isMobileView,
  showChat,
}) => {
  return !showChat || !isMobileView ? (
    <Sider className="chat-sider" width={isMobileView ? "100%" : 300}>
      <div className="chat-title">
        <h3>Conversations</h3>
      </div>
      <Menu mode="inline" selectedKeys={[currentChat?.id?.toString() || ""]}>
        {chats?.map((chat) => (
          <Menu.Item key={chat.id} onClick={() => updateCurrentChat(chat)}>
            {chat?.listing?.title || "Chat"}
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  ) : null;
};

const ChatTitle = ({
  currentChat,
  isMobileView,
  connected,
  username,
  user,
}) => {
  const navigate = useNavigate();
  return (
    <div className="chat-title">
      <div className="title-toggle">
        {isMobileView && (
          <Button
            className="mobile-menu-button"
            icon={<MenuOutlined />}
            onClick={() => navigate("/chat")}
          />
        )}

        <h3
          style={{
            margin: 0,
            marginLeft: isMobileView ? "10px" : "0",
            fontSize: isMobileView ? "0.8rem" : "1rem",
          }}
        >
          {user?.role === "LANDLORD"
            ? getLandlordChatTitle(user.id, currentChat.participants)
            : currentChat?.listing.title}
        </h3>
      </div>

      <div>
        <span
          className="socket"
          style={{ display: "flex", alignItems: "center" }}
        >
          {connected && (
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "green",
                marginRight: "5px",
              }}
            />
          )}
          <p className="user-login">
            {user ? `Logged in: ${username} ` : "Not logged in"}
          </p>
        </span>
      </div>
    </div>
  );
};

const ChatContent = forwardRef(
  (
    {
      currentChat,
      messages,
      sendMessage,
      messageInput,
      setMessageInput,
      isMobileView,
      connected,
      username,
      user,
    },
    ref
  ) => {
    return (
      <Content className="chat-content">
        {currentChat && (
          <ChatTitle
            currentChat={currentChat}
            isMobileView={isMobileView}
            connected={connected}
            username={username}
            user={user}
          />
        )}
        {/* Add participants bar */}
        {currentChat?.participants && (
          <ParticipantsBar participants={currentChat.participants} />
        )}
        <div ref={ref} className="message-box">
          <MessageList
            messages={messages}
            user={user}
            currentChat={currentChat}
            isMobileView={isMobileView}
          />
        </div>
        <MessageInput
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          sendMessage={sendMessage}
          currentChat={currentChat}
        />
      </Content>
    );
  }
);

ChatContent.displayName = "ChatContent";

const MessageList = ({ messages, user, currentChat, isMobileView }) => {
  const navigate = useNavigate();
  return (
    <>
      {!currentChat ? (
        <div>
          {isMobileView && (
            <Button
              className="mobile-menu-button"
              icon={<MenuOutlined />}
              onClick={() => navigate("/chat")}
            />
          )}
          <div className="no-chat-selected">
            Select a chat to start messaging
          </div>
        </div>
      ) : (
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
              {message.senderId !== user.id && (
                <div className="message-username">{`sent by ${getMessageSenderName(
                  message.senderId,
                  currentChat.participants
                )}`}</div>
              )}
            </div>
          </div>
        ))
      )}
    </>
  );
};

const MessageInput = ({
  messageInput,
  setMessageInput,
  sendMessage,
  currentChat,
}) => {
  return currentChat ? (
    <div className="input-area">
      <Input
        placeholder="Type a message..."
        size="large"
        className="input-field"
        value={messageInput}
        onChange={(e) => {
          setMessageInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />
      <Button
        type="primary"
        size="large"
        icon={<SendOutlined />}
        onClick={sendMessage}
      />
    </div>
  ) : null;
};

const ParticipantsBar = ({ participants }) => (
  <div className="participants-bar">
    <span className="participant-title">Participants: </span>
    {participants.map((p) => (
      <span key={p.id} className="participant">
        {p.username}
      </span>
    ))}
  </div>
);

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const showChat = !!id;

  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const messagesRef = React.useRef(null);

  // User Query
  const userQuery = useQuery({
    queryKey: ["user"],
    enabled: !!user,
    queryFn: () => getUserById(user.id),
  });

  // Chat Query
  const chatQuery = useQuery({
    queryKey: ["chat"],
    enabled: !!user,
    queryFn: () => getUserChats(user.id),
  });

  // Messages Query
  const messagesQuery = useQuery({
    queryKey: ["messages", { id: currentChat?.id }],
    enabled: !!currentChat,
    queryFn: () => getMessages(currentChat.id),
  });

  // Handle resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync current chat from location state
  useEffect(() => {
    if (location.state?.chat && chatQuery.data) {
      const currentChat = chatQuery.data.find(
        (c) => c.id === location.state.chat.id
      );
      setCurrentChat(currentChat);
    }
  }, [location.state, chatQuery.data]);

  // update messages on query completion
  useEffect(() => {
    if (messagesQuery.data) {
      setMessages(messagesQuery.data);
    }
  }, [messagesQuery.data]);

  // scroll to bottom on messages change
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

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
      const recipients = currentChat.participants.filter(
        (p) => p.id !== user.id
      );
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

  return (
    <div className="container">
      <Layout style={{ height: "100%" }}>
        <ChatSider
          chats={chatQuery.data}
          currentChat={currentChat}
          updateCurrentChat={updateCurrentChat}
          isMobileView={isMobileView}
          showChat={showChat}
        />

        <ChatContent
          ref={messagesRef}
          currentChat={currentChat}
          messages={messages}
          sendMessage={sendMessage}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          isMobileView={isMobileView}
          connected={connected}
          username={userQuery.data?.username}
          user={user}
        />
      </Layout>
    </div>
  );
};

export default Chat;
