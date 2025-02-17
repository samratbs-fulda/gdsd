import React from "react";
import { Image, Carousel, theme, Col, Row } from "antd";
import './ImageCarousel.css'
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

const ImageCarousel = ({ image }) => {
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const breakpoint = useBreakpoint();

  return (
    <div style={{ backgroundColor: colorBgLayout }}>
      <Carousel arrows infinite={false} adaptiveHeight={false} style={{height: "100%", width: "100%"}}>
        {image.map((image, index) => (
          <Row justify={"center"} align={"middle"} key={index}>
            <Col style={{height: breakpoint.sm ? "60vh" : "40vh", margin: "auto", textAlign:"center"}}>
              <Image src={image} width={"100%"} height={"100%"} style={{objectFit: "contain", maxHeight: "100%", maxWidth: "100%"}} />
            </Col>
          </Row>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;