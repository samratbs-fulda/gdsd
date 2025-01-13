import React from "react";
import { Tooltip, Col, Card, theme } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { StopOutlined } from "@ant-design/icons";

library.add(fas);

const AmenityIcon = ({ amenityBool, iconName, displayTrueOnly, tooltipTrue, tooltipFalse }) => {
  const {
    token: { colorFillAlter },
  } = theme.useToken();

  if (displayTrueOnly && !amenityBool) return;

  const styleCard = {
    background: colorFillAlter,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '4em',
    width: '4em',
    marginRight: 'auto',
    marginLeft: 'auto',
  };

  const styleDivAmenities = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  }

  return (
    <Col xs={8} sm={8} xl={4}>
      {amenityBool ? (
        <Tooltip title={tooltipTrue}>
          <span style={{justifyContent: "center"}}>
            <Card style={styleCard}>
              <div 
                // @ts-ignore
                style={styleDivAmenities}>
                <div style={{ position: "absolute" }}>
                  <FontAwesomeIcon icon={["fas", iconName]} style={{fontSize: "2em"}} />
                </div>
              </div>
            </Card>
          </span>
        </Tooltip>
      ) : (
        <Tooltip title={tooltipFalse}>
          <span>
            <Card style={styleCard}>
              <div
                // @ts-ignore
                style={styleDivAmenities}>
                <div style={{ position: "absolute" }}>
                  <StopOutlined style={{ fontSize: "4em" }} />
                </div>
                <div style={{ position: "absolute" }}>
                  <FontAwesomeIcon icon={["fas", iconName]} style={{ fontSize: "2em" }} />
                </div>
              </div>
            </Card>
          </span>
        </Tooltip>
      )
      }

    </Col>
  );
};

export default AmenityIcon;