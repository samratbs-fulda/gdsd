import React from "react";
import Header from "../components/header/Header";
import Map from "../components/map/Map";
import { Button, Carousel, Image, Col, Row, Tooltip } from "antd";

const ListingDetailsPage = () => {

  // TODO: Get listing from backend
  const listing = {
    id: 0,
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Fulda%2C_Marktstraße%2C_2019-10_CN-01.jpg/1200px-Fulda%2C_Marktstraße%2C_2019-10_CN-01.jpg", "https://placesofgermany.de/wp-content/uploads/2023/04/Fulda-Altstadt.webp"],
    title: "Apartment XY",
    description: "This is apartment xy.",
    availableFrom: null,
    totalRooms: 1,
    size: 23, // TODO: Potentially add in DB
    foor: 1,
    typeOfApartment: "1-room",
    address: "Bahnhofstraße 12, 36037 Fulda",
    longitude: 50.565187,
    latitude: 9.686583,
    rent: 345,
    heatingCost: 85,
    electricityCost: 75,
    wifiCost: 0,
    additionalCost: 0,
    isPetsAllowed: true,
    isSmokingAllowed: false,
    isFurnished: false,
    isFittedKitchenAvailable: true,
    isParkingAvailable: true,
    isGardenAvailable: false,
    isBalconyAvailable: false,
  };


  return (
    <div className="homepage">
      <Header />

      <div className="content">
        <h1>{listing.title}</h1>

        <Carousel arrows infinite={false}>
          {listing.images.map((image, index) => (
            <Image key={index} src={image}></Image>
          ))}
        </Carousel>

        <div className="listingDetails">
          <p>{listing.rent}€</p>
          <p>{listing.address}</p>
          <p>{listing.typeOfApartment}</p>

          <p>Size: {listing.size}²m</p>

          <div className="costs">
            <h3>Costs:</h3>
            <Row gutter={16} >
              <Col span={6}>
                <p>Basic rent:</p>
              </Col>
              <Col span={6}>
                <p>{listing.rent}</p>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <p>Heating costs:</p>
              </Col>
              <Col span={6}>
                <p>+ {listing.heatingCost}€</p>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <p>Electricity costs:</p>
              </Col>
              <Col span={6}>
                <p>+ {listing.heatingCost}€</p>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <p>Wifi costs:</p>
              </Col>
              <Col span={6}>
                <p>+ {listing.wifiCost}€</p>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <p>Additional costs:</p>
              </Col>
              <Col span={6}>
                <p>+ {listing.additionalCost}€</p>
              </Col>
            </Row>
          </div>
        </div>

        <div className="listingIcons">
          {/* Icons from https://uxwing.com/ */}

          {listing.isSmokingAllowed ? (
              <Tooltip title={"No smoking allowed"}>
                <span><Image src="/listing-detail-smoking.svg" width={64}></Image></span>
              </Tooltip>
            ) : (
              <Tooltip title={"No smoking allowed"}>
                <span><Image src="/listing-detail-nosmoking.svg" width={64}></Image></span>
              </Tooltip>
            )
          }
          {listing.isPetsAllowed ? (
              <Tooltip title={"Pets allowed"}>
                <span><Image src="/listing-detail-pets.svg" width={64}></Image></span>
              </Tooltip>
            ) : (
              <Tooltip title={"No pets allowed"}>
                <Image src="/listing-detail-nopets.svg" width={64}
                ></Image>
              </Tooltip>
            )
          }
          {listing.isParkingAvailable && (
              <Tooltip title={"Parking available"}>
                <span><Image src="/listing-detail-parking.svg" width={64}></Image></span>
              </Tooltip>
            )
          }
          {listing.isGardenAvailable && (
              <Tooltip title={"Garden available"}>
                <span><Image src="/listing-detail-garden.svg" width={64}></Image></span>
              </Tooltip>
            )
          }
          {listing.isBalconyAvailable && (
              <Tooltip title={"Balcony available"}>
                <span><Image src="/listing-detail-balcony.svg" width={64}></Image></span>
              </Tooltip>
            )
          }
        </div>

        <Button>Apply</Button> {/* TODO: Add route */}

        <Map longitude={listing.longitude} latitude={listing.latitude} />
      </div>
    </div>
  );
};

export default ListingDetailsPage;
