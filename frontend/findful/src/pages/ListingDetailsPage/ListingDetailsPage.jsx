import React from "react";
import Map from "../../components/map/Map";
import ListingDetailAmenities from "../../components/listingDetails/ListingDetaiAmenities";
import { Col, Row, Layout, theme, Divider, Typography, Spin } from "antd";
import { getListingById } from "../../services/listingService";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import Paragraph from "antd/es/typography/Paragraph";
import ImageCarousel from "../../components/imageCarousel/ImageCarousel";
import "./ListingDetailsPage.css";
import ListingDetailCosts from "../../components/listingDetails/ListingDetailCosts";
import { AppstoreOutlined, BulbOutlined, CalendarOutlined, EnvironmentOutlined, HomeOutlined, TeamOutlined } from "@ant-design/icons";
import GeneralInfoCard from "../../components/listingDetails/GeneralInfoCard";
import { getRoleOfCurrentUser } from "../../services/authRole";
import { useAuth } from "../../services/authContext";
import ButtonsBottom from "../../components/listingDetails/ButtonsBottom";

const { Content } = Layout;

const ListingDetailsPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { user } = useAuth();
  const userId = !user ? -1 : user.id;

  let { id } = useParams();

  const listingsQuery = useQuery({
    queryKey: ["listing", id],
    queryFn: () => {
      return getListingById(id);
    },
  });

  const listing = listingsQuery.data || [];

  const role = getRoleOfCurrentUser();

  return (
    <Layout
      className="page-content-layout"
      id="dashboard"
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Content className="page-inner-content">
        {listing.length == 0 ?
          // Show spinner while the listing is fetched from the backend
          <Spin style={{ width: "100%", paddingLeft: "auto", paddingRight: "auto" }} />
          :
          (<>
            {/* Check if user is allowed to see current listing */}
            {listing.status != "APPROVED" && userId != listing.landlordId && role != "MODERATOR" ?
              <Paragraph>The listing is currently unavailable. Please revisit at a later time.</Paragraph>
              :
              <Typography>
                <Title level={1}>
                  {listing.title}
                  {role == "MODERATOR" && (
                    <Paragraph>
                      Status:{" "}
                      {listing.status == "APPROVED" ? (
                        <Text type="success">Approved</Text>
                      ) : listing.status == "PENDING" ? (
                        <Text type="warning">Pending</Text>
                      ) : listing.status == "REJECTED" ? (
                        <Text type="danger">Rejected</Text>
                      ) : (
                        <Text type="danger">Deleted</Text>
                      )}
                    </Paragraph>
                  )}
                </Title>

                {/* Images */}
                {listing.images && <ImageCarousel image={listing.images} />}
                <Divider />

                {/* Important details section */}
                <div className="listingDetails">
                  <div className="important-details">
                    <Row justify={"space-around"}>
                      <Col xs={12} sm={8}>
                        <Row justify={"center"}>
                          <Title level={4}>{listing.warmRent}€ (warm)</Title>
                        </Row>
                        <Row justify={"center"}>
                          <Paragraph type="secondary">Rent</Paragraph>
                        </Row>
                      </Col>
                      <Col xs={12} sm={8}>
                        <Row justify={"center"}>
                          <Title level={4}>{listing.size}²m</Title>
                        </Row>
                        <Row justify={"center"}>
                          <Paragraph type="secondary">Size</Paragraph>
                        </Row>
                      </Col>
                      <Col xs={12} sm={8}>
                        <Row justify={"center"}>
                          <Title level={4}>{listing.freeRooms}</Title>
                        </Row>
                        <Row justify={"center"}>
                          {listing.freeRooms <= 1 ? (
                            <Paragraph type="secondary">Room</Paragraph>
                          ) : (
                            <Paragraph type="secondary">Rooms</Paragraph>
                          )}
                        </Row>
                      </Col>
                    </Row>
                  </div>
                  <Divider />

                  {/* General Info table */}
                  <Row gutter={[12, 12]} justify={"space-between"}>
                    <GeneralInfoCard>
                      <EnvironmentOutlined
                        style={{ fontSize: "24px", color: "#1890ff" }}
                      />
                      <Title level={5}>Address</Title>
                      <Paragraph>
                        {listing.street} {listing.houseNumber},<br />
                        {listing.postalCode} Fulda
                      </Paragraph>
                    </GeneralInfoCard>

                    <GeneralInfoCard>
                      <CalendarOutlined
                        style={{ fontSize: "24px", color: "#52c41a" }}
                      />
                      <Title level={5}>Availability</Title>
                      <Paragraph>
                        From: {listing.availableFrom?.substring(0, 10)} <br />
                        {listing.availableTill &&
                          `Till: ${listing.availableTill?.substring(0, 10)}`
                        }

                      </Paragraph>
                    </GeneralInfoCard>

                    <GeneralInfoCard>
                      <HomeOutlined style={{ fontSize: "24px", color: "#faad14" }} />
                      <Title level={5}>Furnishing</Title>
                      <Paragraph>
                        {listing.furnished === "FURNISHED"
                          ? "Furnished"
                          : listing.furnished === "PARTIALLY"
                            ? "Partially Furnished"
                            : "Not Furnished"}
                      </Paragraph>
                    </GeneralInfoCard>

                    <GeneralInfoCard>
                      <BulbOutlined style={{ fontSize: "24px", color: "#fadb14" }} />
                      <Title level={5}>Energy Rating</Title>
                      <Paragraph>{listing.energyRating || "N/A"}</Paragraph>
                    </GeneralInfoCard>

                    <GeneralInfoCard>
                      <AppstoreOutlined
                        style={{ fontSize: "24px", color: "#1890ff" }}
                      />
                      <Title level={5}>Type</Title>
                      <Paragraph>
                        {listing.type === "SINGLE"
                          ? "Single Apartment"
                          : listing.type === "SHARED"
                            ? "Shared Apartment"
                            : "Sublet"}
                      </Paragraph>
                    </GeneralInfoCard>

                    <GeneralInfoCard>
                      <TeamOutlined style={{ fontSize: "24px", color: "#722ed1" }} />
                      <Title level={5}>Rooms</Title>
                      <Paragraph>
                        Total: {listing.totalRooms || "N/A"}
                        <br />
                        Available: {listing.freeRooms || "N/A"}
                      </Paragraph>
                    </GeneralInfoCard>
                  </Row>
                  <Divider />

                  {/* Description */}
                  <div className="description">
                    <Title level={3}>Description</Title>
                    <Paragraph>{listing.description}</Paragraph>
                  </div>
                  <Divider />

                  {/* Costs */}
                  <ListingDetailCosts
                    costs={{
                      coldRent: listing.coldRent,
                      heatingCost: listing.heatingCost,
                      additionalCosts: listing.additionalCosts,
                      warmRent: listing.warmRent,
                      deposit: listing.deposit,
                    }}
                  />
                  <Divider />

                  {/* Amenities */}
                  <ListingDetailAmenities amenities={listing.amenities} />
                  <Divider />

                  {/* Documents */}
                  {listing.documents && (
                    <div className="listingDocuments">
                      <Title level={3}>Documents needed to apply: </Title>
                      <ul style={{ listStyleType: "disc" }}>
                        {listing.documents?.proofOfIncome && (
                          <li>
                            <Paragraph>Proof of Income</Paragraph>
                          </li>
                        )}
                        {listing.documents?.proofOfIdentity && (
                          <li>
                            <Paragraph>Proof of Identidy</Paragraph>
                          </li>
                        )}
                        {listing.documents?.shufaCreditReport && (
                          <li>
                            <Paragraph>Schufa credit report</Paragraph>
                          </li>
                        )}
                        {listing.documents?.parentalGuarantee && (
                          <li>
                            <Paragraph>Parental guarantee</Paragraph>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Apply or Reject/Approve button - dependent on role */}
                  <ButtonsBottom listing={listing} role={role} userId={userId} />

                  {/* Map */}
                  {listing.longitude && listing.latitude && (
                    <Map longitude={listing.longitude} latitude={listing.latitude} distanceFromUni={listing.distanceFromUni} title={listing.title} />
                  )}
                </div>
              </Typography>}</>)
        }
      </Content>
    </Layout>
  );
};

export default ListingDetailsPage;
