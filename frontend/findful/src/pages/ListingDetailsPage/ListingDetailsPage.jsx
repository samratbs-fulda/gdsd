import React from "react";
import Map from "../../components/map/Map";
import ListingDetailAmenities from "../../components/listingDetails/ListingDetaiAmenities";
import { Button, Carousel, Image, Col, Row, Layout, theme, List, Space, Card, Divider, Typography, Tag } from "antd";
import { getListingById } from "../../services/listingService";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Column from "antd/es/table/Column";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import ImageCarousel from "../../components/imageCarousel/ImageCarousel";
import "./ListingDetailsPage.css"
import ListingDetailCosts from "../../components/listingDetails/ListingDetailCosts";
import { AppstoreOutlined, CalendarOutlined, EnvironmentOutlined, HomeOutlined, StarOutlined, TeamOutlined } from "@ant-design/icons";

const { Content } = Layout;

const ListingDetailsPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG, colorTextLightSolid },
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
  listing.longitude = 50.565187;
  listing.latitude = 9.686583;

  return (
    <Layout className='page-content-layout' id='dashboard'
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Content className='page-inner-content'>
        <Typography>
          <Title level={1}>{listing?.title}</Title>

          {listing?.images && (
            <ImageCarousel image={listing?.images} />

          )}
          <Divider />

          <div className="listingDetails">
            <div className="important-details">
              <Row justify={"space-around"}>
                <Col>
                  <Row justify={"center"}>
                    <Title level={4}>{listing?.warmRent}€ (warm)</Title>
                  </Row>
                  <Row justify={"center"}>
                    <Paragraph type="secondary">Rent</Paragraph>
                  </Row>
                </Col>
                <Col>
                  <Row justify={"center"}>
                    <Title level={4}>{listing?.size}²m</Title>
                  </Row>
                  <Row justify={"center"}>
                    <Paragraph type="secondary">Size</Paragraph>
                  </Row>
                </Col>
                <Col>
                  <Row justify={"center"}>
                    <Title level={4}>{listing?.freeRooms}</Title>
                  </Row>
                  <Row justify={"center"}>
                    {listing?.freeRooms <= 1 ? (<Paragraph type="secondary">Room</Paragraph>) : (<Paragraph type="secondary">Rooms</Paragraph>)}
                  </Row>
                </Col>
              </Row>
            </div>
            <Divider />

            
            <Row gutter={[12,8]} justify={"space-around"}>
              {/* Address Section */}
              <Col span={8}>
                <Card>
                  <EnvironmentOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                  <Title level={5}>Address</Title>
                  <Paragraph>
                    {listing?.street} {listing?.houseNumber},<br />
                    {listing?.postalCode} Fulda
                  </Paragraph>
                </Card>
              </Col>

              {/* Availability Section */}
              <Col span={8}>
                <Card>
                  <CalendarOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                  <Title level={5}>Availability</Title>
                  <Paragraph>
                    From: {listing?.availableFrom?.substring(0, 10)} <br />
                    Till: {listing?.availableTill?.substring(0, 10)}
                  </Paragraph>
                </Card>
              </Col>

              {/* Furnishing Section */}
              <Col span={8}>
                <Card>
                  <HomeOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                  <Title level={5}>Furnishing</Title>
                  <Paragraph>
                    {listing?.furnished === 'FURNISHED' ? 'Furnished' :
                      listing?.furnished === 'PARTIALLY' ? 'Partially Furnished' :
                      'Not Furnished'}
                  </Paragraph>
                </Card>
              </Col>
              
              {/* Energy Rating */}
              <Col span={8}>
                <Card>
                  <StarOutlined style={{ fontSize: '24px', color: '#fadb14' }} />
                  <Title level={5}>Energy Rating</Title>
                  <Paragraph>{listing?.energyRating || 'N/A'}</Paragraph>
                </Card>
              </Col>

              {/* Type of Apartment */}
              <Col span={8}>
                <Card>
                  <AppstoreOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                  <Title level={5}>Type</Title>
                  <Paragraph>
                    {listing?.type === 'SINGLE' ? 'Single Apartment' :
                      listing?.type === 'SHARED' ? 'Shared Apartment' :
                        'Sublet'}
                  </Paragraph>
                </Card>
              </Col>

              {/* Rooms Section */}
              <Col span={8}>
                <Card>
                  <TeamOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
                  <Title level={5}>Rooms</Title>
                  <Paragraph>
                    Total: {listing?.totalRooms || 'N/A'}<br />
                    Available: {listing?.freeRooms || 'N/A'}
                  </Paragraph>
                </Card>
              </Col>
            </Row>
            <Divider />

            <div className="description">
              <Title level={3}>Description</Title>
              <Paragraph>{listing?.description}</Paragraph>
            </div>
            <Divider />

            <ListingDetailCosts costs={{ coldRent: listing?.coldRent, heatingCost: listing?.heatingCost, additionalCosts: listing?.additionalCosts, warmRent: listing?.warmRent, deposit: listing?.deposit }} />
            <Divider />

            <ListingDetailAmenities amenities={listing?.amenities} />
            <Divider />

            {listing.documents && (
              <div className="listingDocuments">
                <Title level={3}>Documents needed to apply: </Title>
                <ul>
                  {listing?.documents?.proofOfIncome && (
                    <li>
                      Proof of Income
                    </li>)
                  }
                  {listing?.documents?.proofOfIdentity && (
                    <li>
                      Proof of Identidy
                    </li>)
                  }
                  {listing?.documents?.shufaCreditReport && (
                    <li>
                      Schufa credit report
                    </li>)
                  }
                  {listing?.documents?.parentalGuarantee && (
                    <li>
                      Parental guarantee
                    </li>)
                  }
                </ul>
              </div>
            )}


            <Button>Apply</Button> {/* TODO: Add route */}

            <Map longitude={listing.longitude} latitude={listing.latitude} />
          </div>

        </Typography>
      </Content>
    </Layout>
  );
};

export default ListingDetailsPage;
