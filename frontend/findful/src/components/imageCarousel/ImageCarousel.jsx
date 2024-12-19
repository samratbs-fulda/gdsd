import React from "react";
import { Image, Carousel } from "antd";
import './ImageCarousel.css'

const ImageCarousel = ({image}) => {
  return (
    <div className="image-carousel">
      <Carousel arrows infinite={false} adaptiveHeight={false} style={{maxHeight: "50%", width: "80%"}}>
        {image.map((image, index) => (
          <Image className="image-carousel-images" key={index} src={image} style={{height: "50px"}}></Image>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;