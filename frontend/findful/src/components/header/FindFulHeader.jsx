import React from "react";
import "./FindFulHeader.css";
import { Avatar, Col, Dropdown, Row, Image, Button, theme } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getRoleOfCurrentUser } from "../../services/authRole";

const FindFulHeader = () => {
  const {
    token: { colorBgBase, colorText },
  } = theme.useToken();

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  }

  // Set Dropdown menu items according to the role of the user
  const role = getRoleOfCurrentUser();
  let items =
    role === "STUDENT" ?
      [
        { key: "chat", label: <a href="/chat">Messages</a> },
        { key: "profile", label: <a href="/profile">Profile</a> },
        { key: "logout", label: "Logout", onClick: logout },
      ]
      : role === "LANDLORD" ?
        [
          { key: "chat", label: <a href="/chat">Messages</a> },
          // TODO: Change route to the route of the landlord dashboard, once implemented
          { key: "dashboard", label: <a href="/dashboard/landlord">Dashboard</a> },
          { key: "profile", label: <a href="/profile">Profile</a> },
          { key: "logout", label: "Logout", onClick: logout },
        ]
        : role === "MODERATOR" ?
          [
            { key: "dashboard", label: <a href="/dashboard">Dashboard</a> },
            { key: "logout", label: "Logout", onClick: logout },
          ]
          :
          [
            { key: "login", label: <a href="/login">Login</a> },
            { key: "register", label: <a href="/register">Register</a> },
          ];

  return (
    <div className="findful-header">
      <Row justify={(window.location.pathname === "/register" || window.location.pathname === "/login") ? "center" : "space-between"}
        align={"middle"} style={{ height: "100%", width: "100%" }}>

        {/* Logo button */}
        <Col xs={8} md={6} xl={4} style={{ height: "100%" }}>
          <Button className="header-button" href="/" type="link"
            style={{
              maxWidth: "fit-content",
              marginLeft: (!(window.location.pathname === "/register") && !(window.location.pathname === "/login")) && 0,
            }}>
            <Image height={"100%"} src="/findful-logo-black.png" preview={false} style={{ maxWidth: "100%", objectFit: "contain" }} />
          </Button>
        </Col>

        {/* Profile Dropdown (Not displayed on login and register page) */}
        {(!(window.location.pathname === "/register") && !(window.location.pathname === "/login")) &&
          (<Col xs={8} md={6} xl={4} style={{ height: "100%" }}>
            <Dropdown menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }} overlayStyle={{ width: "20%" }}>
              <Button className="header-button" type="link" style={{ marginRight: 0 }}>
                <Avatar icon={<UserOutlined style={{ height: "100%", color: colorText }} />} shape="circle"
                  style={{ height: "100%", width: "auto", objectFit: "fill", aspectRatio: "1 / 1", fontSize: "2.5em", backgroundColor: colorBgBase }} />
              </Button>
            </Dropdown>
          </Col>)
        }
      </Row>
    </div>
  );
};

export default FindFulHeader;
