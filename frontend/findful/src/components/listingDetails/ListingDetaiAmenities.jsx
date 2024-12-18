import React from "react";
import { Tooltip, Image } from "antd";

const ListingDetailAmenities =  (amenities) => {
  return (
    <div className="listingIcons">
      <h3>Amenities:</h3>
          {/* Icons from https://uxwing.com/ */}
          {amenities.parkingAvailable && (
            <Tooltip title={"Parking available"}>
              <span><Image src="/listing-detail-parking.svg" width={64}></Image></span>
            </Tooltip>
          )
          }
          {amenities.balconyAvailable && (
            <Tooltip title={"Balcony available"}>
              <span><Image src="/listing-detail-balcony.svg" width={64}></Image></span>
            </Tooltip>
          )
          }
          {amenities.gardenAvailable && (
            <Tooltip title={"Garden available"}>
              <span><Image src="/listing-detail-garden.svg" width={64}></Image></span>
            </Tooltip>
          )
          }

          {amenities.smokingAllowed ? (
            <Tooltip title={"No smoking allowed"}>
              <span><Image src="/listing-detail-smoking.svg" width={64}></Image></span>
            </Tooltip>
          ) : (
            <Tooltip title={"No smoking allowed"}>
              <span><Image src="/listing-detail-nosmoking.svg" width={64}></Image></span>
            </Tooltip>
          )
          }
          {amenities.petsAllowed ? (
            <Tooltip title={"Pets allowed"}>
              <span><Image src="/listing-detail-pets.svg" width={64}></Image></span>
            </Tooltip>
          ) : (
            <Tooltip title={"No pets allowed"}>
              <span><Image src="/listing-detail-nopets.svg" width={64}
              ></Image></span>
            </Tooltip>
          )
          }
        </div>
  );
};

export default ListingDetailAmenities;