import React from "react";
import { Tooltip, Image, Row, Col, Card, theme } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { StopOutlined } from "@ant-design/icons";
import AmenityIcon from "./AmenityIcon";

library.add(fas);

const GeneralInfoCard = ({children}) => {
  const {
    token: { colorFillAlter },
  } = theme.useToken();

  return (
    <Col xs={12} xl={8}>
      <Card>
        {children}
      </Card>
    </Col>
  );
};

export default GeneralInfoCard;