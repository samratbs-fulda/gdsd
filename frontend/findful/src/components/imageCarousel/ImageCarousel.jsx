import React from "react";
import { Image, Carousel, theme } from "antd";
import './ImageCarousel.css'
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

const ImageCarousel = ({ image }) => {
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const breakpoint = useBreakpoint();
  return (
    <div style={{ backgroundColor: colorBgLayout}}>
      <Carousel arrows infinite={false} adaptiveHeight={false} style={{height: "100%", width: "100%"}}>
        {image.map((image, index) => (
          <Image key={index} src={image} height={image.height > image.width ? "auto" : "60vh"} width={image.height > image.width ? "100%" : "auto"} />
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;