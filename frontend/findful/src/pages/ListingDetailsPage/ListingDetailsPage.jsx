import React from "react";
import Header from "../../components/header/FindFulHeader";
import Map from "../../components/map/Map";
import ListingDetailAmenities from "../../components/listingDetails/ListingDetaiAmenities";
import { Button, Carousel, Image, Col, Row, Tooltip, Layout, theme, List, Space } from "antd";

const { Content } = Layout;

const ListingDetailsPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // TODO: Get listing from backend
  const listing = {
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Fulda%2C_Marktstraße%2C_2019-10_CN-01.jpg/1200px-Fulda%2C_Marktstraße%2C_2019-10_CN-01.jpg", "https://placesofgermany.de/wp-content/uploads/2023/04/Fulda-Altstadt.webp"],
    title: "Apartment XY",
    description: "This is apartment xy.",
    size: 23,
    foor: 1,
    typeOfApartment: 'SINGLE',
    availableFrom: "12-12-2024",
    availableTill: "12-12-2025",
    totalRooms: 1,
    freeRooms: 1,
    energyRating: "D",
    warmRent: 350,
    coldRent: 300,
    heatingCost: 50,
    additionalCosts: 0,
    deposit: 600,
    street: "Bahnhofstraße",
    houseNumber: "12",
    postalCode: 36037,
    furnished: "PARTIALLY",
    amenities: {
      parkingAvailable: true,
      balconyAvailable: false,
      gardenAvailable: false,
      storageAvailable: false,
      dishWasherAvailalbe: false,
      washingMachineAvailable: true,
      wifiAvailable: true,
      tvCableIncluded: true,
      petsAllowed: false,
      smokingAllowed: false,
    },
    documents: {
      proofOfIncome: true,
      proofOfIdentity: true,
      shufaCreditReport: true,
      parentalGuarantee: false,
    },
    longitude: 50.565187,
    latitude: 9.686583,
  };


  return (
    <Layout className='page-content-layout' id='dashboard'
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Content className='page-inner-content'>
        <h1>{listing.title}</h1>

        <Carousel arrows infinite={false} className="imageCarousel">
          {listing.images.map((image, index) => (
            <Image key={index} src={image}></Image>
          ))}
        </Carousel>

        <div className="listingDetails">
          <Space direction="vertical">
            <Space direction="vertical">
              <p>{listing.warmRent}€ (warm)</p>
              <p>{listing.street} {listing.houseNumber}, {listing.postalCode} Fulda</p>
              <p>{listing.typeOfApartment == "SINGLE" && ("Single apartment")}</p>
              <p>{listing.furnished == 'PARTIALLY' && ("Partially")} furnished</p>

              <p>Size: {listing.size}²m</p>

              <p>Available from: {listing.availableFrom}</p>
              <p>Available till: {listing.availableTill}</p>
            </Space>
            <p>Total Rooms of the : {listing.totalRooms}</p>
            <p>Rooms available to rent: {listing.freeRooms}</p>
            <p>Energy rating: {listing.energyRating}</p>
          </Space>

          <div className="costs">
            <h3>Costs:</h3>
            <Row gutter={16} >
              <Col span={6}>
                <p>Cold rent:</p>
              </Col>
              <Col span={6}>
                <p>{listing.coldRent}</p>
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
                <p>Additional costs:</p>
              </Col>
              <Col span={6}>
                <p>+ {listing.additionalCosts}€</p>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <p>Warm rent:</p>
              </Col>
              <Col span={6}>
                <p>= {listing.warmRent}€</p>
              </Col>
            </Row>
          </div>



          <ListingDetailAmenities amenities={listing.amenities} />

          <div className="documents">
            <p>Documents needed to apply: </p>
            <List >
              {listing.documents.proofOfIncome && (
                <List.Item>
                  Proof of Income
                </List.Item>)
              }
              {listing.documents.proofOfIdentity && (
                <List.Item>
                  Proof of Identidy
                </List.Item>)
              }
              {listing.documents.shufaCreditReport && (
                <List.Item>
                  Schufa credit report
                </List.Item>)
              }
              {listing.documents.parentalGuarantee && (
                <List.Item>
                  Parental guarantee
                </List.Item>)
              }
            </List>
          </div>

          <Button>Apply</Button> {/* TODO: Add route */}

          <Map longitude={listing.longitude} latitude={listing.latitude} />
        </div>
      </Content>
    </Layout>
  );
};

export default ListingDetailsPage;
