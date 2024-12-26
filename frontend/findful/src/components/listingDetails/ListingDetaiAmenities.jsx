import React from "react";
import { Row, theme } from "antd";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import AmenityIcon from "./AmenityIcon";

library.add(fas);

const ListingDetailAmenities = ({ amenities }) => {
  const {
    token: { colorFillAlter },
  } = theme.useToken();

  return (
    <div className="listingIcons">
      <h3>Amenities:</h3>
      <Row justify={"space-between"} gutter={[16,16]}>
        <AmenityIcon amenityBool={amenities?.kitchenFitted} iconName={"kitchen-set"} displayTrueOnly={true} tooltipTrue={"Fitted kitchen"} tooltipFalse={""} />
        <AmenityIcon amenityBool={amenities?.petsAllowed} iconName={"dog"} displayTrueOnly={false} tooltipTrue={"Pets allowed"} tooltipFalse={"No pets allowed"} />
        <AmenityIcon amenityBool={amenities?.parkingAvailable} iconName={"car"} displayTrueOnly={true} tooltipTrue={"Parking available"} tooltipFalse={""} />
        <AmenityIcon amenityBool={amenities?.balconyAvailable} iconName={"house-chimney-window"} displayTrueOnly={true} tooltipTrue={"Has a balcony"} tooltipFalse={""} />
        <AmenityIcon amenityBool={amenities?.gardenAvailable} iconName={"tree"} displayTrueOnly={true} tooltipTrue={"Has a garden"} tooltipFalse={""} />
        <AmenityIcon amenityBool={amenities?.wifiAvailable} iconName={"wifi"} displayTrueOnly={true} tooltipTrue={"Wifi available"} tooltipFalse={""} />
        <AmenityIcon amenityBool={amenities?.storageAvailable} iconName={"boxes-packing"} displayTrueOnly={true} tooltipTrue={"Storage available"} tooltipFalse={""} />
        <AmenityIcon amenityBool={amenities?.smokingAllowed} iconName={"smoking"} displayTrueOnly={false} tooltipTrue="Smoking allowed" tooltipFalse="Smoking not allowed" />
        <AmenityIcon amenityBool={amenities?.dishWasherAvailalbe} iconName={"sink"} displayTrueOnly={true} tooltipTrue={"Has a dishwasher"} tooltipFalse={""} />
        <AmenityIcon amenityBool={amenities?.washingMachineAvailable} iconName={"shirt"} displayTrueOnly={true} tooltipTrue={"Has a washing machine"} tooltipFalse={""} />
        <AmenityIcon amenityBool={amenities?.tvCableIncluded} iconName={"tv"} displayTrueOnly={true} tooltipTrue={"Cable TV available"} tooltipFalse={""} />
      </Row>
    </div>
  );
};

export default ListingDetailAmenities;