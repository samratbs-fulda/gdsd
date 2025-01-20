import React from "react";
import Map from "../../components/map/Map";
import ListingDetailAmenities from "../../components/listingDetails/ListingDetaiAmenities";
import {
  Button,
  Col,
  Row,
  Layout,
  theme,
  Divider,
  Typography,
  Flex,
  Tooltip,
  message,
  // Space,
} from "antd";
import { getListingById } from "../../services/listingService";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import Paragraph from "antd/es/typography/Paragraph";
import ImageCarousel from "../../components/imageCarousel/ImageCarousel";
import "./ListingDetailsPage.css";
import ListingDetailCosts from "../../components/listingDetails/ListingDetailCosts";
import {
  AppstoreOutlined,
  BulbOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import GeneralInfoCard from "../../components/listingDetails/GeneralInfoCard";
// import { jwtDecode } from "jwt-decode";
import { getRoleOfCurrentUser } from "../../services/authRole";
import { updateListingStatus } from "../../services/reviewContent/reviewListingService";
import { createUserChats } from "../../services/chatService";
import { useAuth } from "../../services/authContext";

const { Content } = Layout;

const ListingDetailsPage = () => {
  const navigate = useNavigate();
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

  // TODO: Delete once longitude & latitude is calculated in backend
  listing.longitude = 50.565187;
  listing.latitude = 9.686583;

  const createChatMutation = useMutation({
    mutationFn: (landlordId) => {
      console.log(
        "Mutation: Creating chat between",
        landlordId
      );
      return createUserChats(user.id, landlordId);
    },
    onSuccess: (response) => {
      // You might want to show a success message or redirect to the chat page
      console.log("Chat created successfully", response);
      navigate(`/chat/${response.id}`);
    },
    onError: (error) => {
      console.error("Error creating chat:", error);
    },
  });

  const sendMessage = (landlordId) => {
    if (!user || !landlordId) {
      console.error("Missing user or landlord information");
      return;
    }
    console.log(
      "SendMessage: Creating chat between",
      user.id,
      "and",
      landlordId
    );
    createChatMutation.mutate(landlordId);
  };

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
        <Typography>
          <Title level={1}>
            {listing?.title}
            {role == "MODERATOR" && (
              <Paragraph>
                Status:{" "}
                {listing?.status == "APPROVED" ? (
                  <Text type="success">Approved</Text>
                ) : listing?.status == "PENDING" ? (
                  <Text type="warning">Pending</Text>
                ) : listing?.status == "REJECTED" ? (
                  <Text type="danger">Rejected</Text>
                ) : (
                  <Text type="danger">Deleted</Text>
                )}
              </Paragraph>
            )}
          </Title>

          {listing?.images && <ImageCarousel image={listing?.images} />}
          <Divider />

          {/* Important details section */}
          <div className="listingDetails">
            <div className="important-details">
              <Row justify={"space-around"}>
                <Col xs={12} sm={8}>
                  <Row justify={"center"}>
                    <Title level={4}>{listing?.warmRent}€ (warm)</Title>
                  </Row>
                  <Row justify={"center"}>
                    <Paragraph type="secondary">Rent</Paragraph>
                  </Row>
                </Col>
                <Col xs={12} sm={8}>
                  <Row justify={"center"}>
                    <Title level={4}>{listing?.size}²m</Title>
                  </Row>
                  <Row justify={"center"}>
                    <Paragraph type="secondary">Size</Paragraph>
                  </Row>
                </Col>
                <Col xs={12} sm={8}>
                  <Row justify={"center"}>
                    <Title level={4}>{listing?.freeRooms}</Title>
                  </Row>
                  <Row justify={"center"}>
                    {listing?.freeRooms <= 1 ? (
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
                  {listing?.street} {listing?.houseNumber},<br />
                  {listing?.postalCode} Fulda
                </Paragraph>
              </GeneralInfoCard>

              <GeneralInfoCard>
                <CalendarOutlined
                  style={{ fontSize: "24px", color: "#52c41a" }}
                />
                <Title level={5}>Availability</Title>
                <Paragraph>
                  From: {listing?.availableFrom?.substring(0, 10)} <br />
                  Till: {listing?.availableTill?.substring(0, 10)}
                </Paragraph>
              </GeneralInfoCard>

              <GeneralInfoCard>
                <HomeOutlined style={{ fontSize: "24px", color: "#faad14" }} />
                <Title level={5}>Furnishing</Title>
                <Paragraph>
                  {listing?.furnished === "FURNISHED"
                    ? "Furnished"
                    : listing?.furnished === "PARTIALLY"
                    ? "Partially Furnished"
                    : "Not Furnished"}
                </Paragraph>
              </GeneralInfoCard>

              <GeneralInfoCard>
                <BulbOutlined style={{ fontSize: "24px", color: "#fadb14" }} />
                <Title level={5}>Energy Rating</Title>
                <Paragraph>{listing?.energyRating || "N/A"}</Paragraph>
              </GeneralInfoCard>

              <GeneralInfoCard>
                <AppstoreOutlined
                  style={{ fontSize: "24px", color: "#1890ff" }}
                />
                <Title level={5}>Type</Title>
                <Paragraph>
                  {listing?.type === "SINGLE"
                    ? "Single Apartment"
                    : listing?.type === "SHARED"
                    ? "Shared Apartment"
                    : "Sublet"}
                </Paragraph>
              </GeneralInfoCard>

              <GeneralInfoCard>
                <TeamOutlined style={{ fontSize: "24px", color: "#722ed1" }} />
                <Title level={5}>Rooms</Title>
                <Paragraph>
                  Total: {listing?.totalRooms || "N/A"}
                  <br />
                  Available: {listing?.freeRooms || "N/A"}
                </Paragraph>
              </GeneralInfoCard>
            </Row>
            <Divider />

            {/* Description */}
            <div className="description">
              <Title level={3}>Description</Title>
              <Paragraph>{listing?.description}</Paragraph>
            </div>
            <Divider />

            {/* Costs */}
            <ListingDetailCosts
              costs={{
                coldRent: listing?.coldRent,
                heatingCost: listing?.heatingCost,
                additionalCosts: listing?.additionalCosts,
                warmRent: listing?.warmRent,
                deposit: listing?.deposit,
              }}
            />
            <Divider />

            {/* Amenities */}
            <ListingDetailAmenities amenities={listing?.amenities} />
            <Divider />

            {/* Documents */}
            {listing.documents && (
              <div className="listingDocuments">
                <Title level={3}>Documents needed to apply: </Title>
                <ul style={{ listStyleType: "disc" }}>
                  {listing?.documents?.proofOfIncome && (
                    <li>
                      <Paragraph>Proof of Income</Paragraph>
                    </li>
                  )}
                  {listing?.documents?.proofOfIdentity && (
                    <li>
                      <Paragraph>Proof of Identidy</Paragraph>
                    </li>
                  )}
                  {listing?.documents?.shufaCreditReport && (
                    <li>
                      <Paragraph>Schufa credit report</Paragraph>
                    </li>
                  )}
                  {listing?.documents?.parentalGuarantee && (
                    <li>
                      <Paragraph>Parental guarantee</Paragraph>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Apply button - dependent on role (or ) */}
            <Flex justify="center">
              <Paragraph style={{ width: "100%" }}>
                <Row justify={"center"}>
                  {role == "STUDENT" ? (
                    <Col lg={2} xs={4}>
                      <Button
                        color="primary"
                        style={{ width: "100%" }}
                        onClick={() => sendMessage(listing?.landlordId)}
                      >
                        Apply
                      </Button>
                    </Col>
                  ) : role == "GUEST" ? (
                    <Col lg={2} xs={4}>
                      <Tooltip title="Please login to apply for listings.">
                        <Button
                          color="primary"
                          disabled={true}
                          style={{ width: "100%" }}
                        >
                          Apply
                        </Button>
                      </Tooltip>
                    </Col>
                  ) : role == "MODERATOR" ? (
                    listing?.status == "PENDING" ? (
                      <>
                        <Col lg={2} xs={4}>
                          <Button
                            key="approve"
                            type="primary"
                            style={{ width: "100%" }}
                            onClick={async () => {
                              await updateListingStatus(listing.id, "APPROVED");
                              message.success("Listing approved successfully");
                              navigate("/dashboard");
                            }}
                          >
                            Approve
                          </Button>
                        </Col>
                        <Col lg={2} xs={4} offset={1}>
                          <Button
                            key="reject"
                            type="primary"
                            style={{ width: "100%" }}
                            onClick={async () => {
                              await updateListingStatus(listing.id, "REJECTED");
                              message.success("Listing rejected successfully");
                              navigate("/dashboard");
                            }}
                          >
                            Reject
                          </Button>
                        </Col>
                      </>
                    ) : listing?.status == "APPROVED"   ? (
                      <>
                        <Col lg={2} xs={4}>
                          <Button
                            key="reject"
                            type="primary"
                            style={{ width: "100%" }}
                            onClick={async () => {
                              await updateListingStatus(listing.id, "REJECTED");
                              message.success("Listing rejected successfully");
                              navigate("/dashboard");
                            }}
                          >
                            Reject
                          </Button>
                        </Col>
                        <Col lg={2} xs={4} offset={1}>
                          <Button
                            key="delete"
                            type="primary"
                            style={{ width: "100%" }}
                            onClick={async () => {
                              await updateListingStatus(listing.id, "DELETED");
                              message.success("Listing deleted successfully");
                              navigate("/dashboard");
                            }}
                          >
                            Delete
                          </Button>
                        </Col>
                      </>
                    ) : listing?.status == "REJECTED" ? (
                      <>
                        <Col lg={2} xs={4}>
                          <Button
                            key="approve"
                            type="primary"
                            style={{ width: "100%" }}
                            onClick={async () => {
                              await updateListingStatus(listing.id, "APPROVED");
                              message.success("Listing approved successfully");
                              navigate("/dashboard");
                            }}
                          >
                            Approve
                          </Button>
                        </Col>
                        <Col lg={2} xs={4} offset={1}>
                          <Button
                            key="delete"
                            type="primary"
                            style={{ width: "100%" }}
                            onClick={async () => {
                              await updateListingStatus(listing.id, "DELETED");
                              message.success("Listing deleted successfully");
                              navigate("/dashboard");
                            }}
                          >
                            Delete
                          </Button>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col lg={2} xs={4}>
                          <Button
                            key="restore"
                            type="primary"
                            style={{ width: "100%" }}
                            onClick={async () => {
                              await updateListingStatus(listing.id, "PENDING");
                              message.success("Listing restore successfully");
                              navigate("/dashboard");
                            }}
                          >
                            Restore
                          </Button>
                        </Col>
                      </>
                    )
                  ) : (
                    listing?.landlordId !== userId ? (
                    <Col lg={2} xs={4}>
                      <Tooltip title="Only students can apply for listings.">
                        <Button
                          color="primary"
                          disabled={true}
                          style={{ width: "100%" }}
                        >
                          Apply
                        </Button>
                      </Tooltip>
                    </Col>
                    ) : (
                      <>
                        <Col lg={2} xs={4}>
                          <Button
                            key="manage"
                            type="primary"
                            style={{ width: "100%" }}
                            onClick={async () => {
                              navigate("/dashboard/landlord");
                            }}
                          >
                            Manage
                          </Button>
                        </Col>
                      </>
                    )
                  )}
                </Row>
              </Paragraph>
            </Flex>

            {/* Map */}
            <Map longitude={listing.longitude} latitude={listing.latitude} />
          </div>
        </Typography>
      </Content>
    </Layout>
  );
};

export default ListingDetailsPage;
