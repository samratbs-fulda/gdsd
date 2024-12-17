import React from "react";
import Map from "../../components/map/Map";
import ListingDetailAmenities from "../../components/listingDetails/ListingDetaiAmenities";
import { Button, Carousel, Image, Col, Row, Layout, theme, List, Space } from "antd";
import { getListingById } from "../../services/listingService";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const { Content } = Layout;

const ListingDetailsPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  let { id } = useParams();

  const listingsQuery = useQuery({
    queryKey: ["listing", id],
    queryFn: () => {
      return getListingById(id);
    },
  });


  const listing = listingsQuery.data || [];

  // TODO: Delete once longitude & latitude is calculated in backend
  listing.longitude= 50.565187;
  listing.latitude= 9.686583;

  return (
    <Layout className='page-content-layout' id='dashboard'
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Content className='page-inner-content'>
        <h1>{listing?.title}</h1>

        <Carousel arrows infinite={false} className="imageCarousel">
          {listing?.images?.map((image, index) => (
            <Image key={index} src={image}></Image>
          ))}
        </Carousel>

        <div className="listingDetails">
          <Space direction="vertical">
            <Space direction="vertical">
              <p>{listing?.warmRent}€ (warm)</p>
              <p>{listing?.street} {listing?.houseNumber}, {listing?.postalCode} Fulda</p>
              <p>{listing?.typeOfApartment == "SINGLE" && ("Single apartment")}</p>
              <p>{listing?.furnished == 'PARTIALLY' && ("Partially")} furnished</p>

              <p>Size: {listing?.size}²m</p>

              <p>Available from: {listing?.availableFrom?.substring(0, 10)}</p>
              <p>Available till: {listing?.availableTill?.substring(0, 10)}</p>
            </Space>
            <p>Total Rooms of the : {listing?.totalRooms}</p>
            <p>Rooms available to rent: {listing?.freeRooms}</p>
            <p>Energy rating: {listing?.energyRating}</p>
          </Space>

          <div className="costs">
            <h3>Costs:</h3>
            <Row gutter={16} >
              <Col span={6}>
                <p>Cold rent:</p>
              </Col>
              <Col span={6}>
                <p>{listing?.coldRent}</p>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <p>Heating costs:</p>
              </Col>
              <Col span={6}>
                <p>+ {listing?.heatingCost}€</p>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <p>Additional costs:</p>
              </Col>
              <Col span={6}>
                <p>+ {listing?.additionalCosts}€</p>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <p>Warm rent:</p>
              </Col>
              <Col span={6}>
                <p>= {listing?.warmRent}€</p>
              </Col>
            </Row>
          </div>



          <ListingDetailAmenities amenities={listing?.amenities} />

          {listing.documents && (
            <div className="listingDocuments">
              <p>Documents needed to apply: </p>
              <List >
                {listing?.documents?.proofOfIncome && (
                  <List.Item>
                    Proof of Income
                  </List.Item>)
                }
                {listing?.documents?.proofOfIdentity && (
                  <List.Item>
                    Proof of Identidy
                  </List.Item>)
                }
                {listing?.documents?.shufaCreditReport && (
                  <List.Item>
                    Schufa credit report
                  </List.Item>)
                }
                {listing?.documents?.parentalGuarantee && (
                  <List.Item>
                    Parental guarantee
                  </List.Item>)
                }
              </List>
            </div>
          )}


          <Button>Apply</Button> {/* TODO: Add route */}

          <Map longitude={listing.longitude} latitude={listing.latitude} />
        </div>
      </Content>
    </Layout>
  );
};

export default ListingDetailsPage;
