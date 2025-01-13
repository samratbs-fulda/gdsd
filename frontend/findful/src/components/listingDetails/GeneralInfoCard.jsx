import React from "react";
import { Col, Card, theme } from "antd";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

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