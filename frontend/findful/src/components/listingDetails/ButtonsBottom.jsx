import React from "react";
import { Col, Card, theme, Flex, Row, Button, Tooltip, message } from "antd";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Paragraph from "antd/es/typography/Paragraph";
import { useNavigate } from "react-router-dom";
import { updateListingStatus } from "../../services/reviewContent/reviewListingService";

library.add(fas);

const ButtonsBottom = ({ listing, role, userId }) => {
  const navigate = useNavigate();

  return (
    <Flex justify="center">
      <Paragraph style={{ width: "100%" }}>
        <Row justify={"center"}>
          {role == "STUDENT" ? (
            <Col lg={2} xs={4}>
              <Button
                color="primary"
                style={{ width: "100%" }}
                onClick={() => navigate("/listing/apply/" + listing.id)}
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
            listing.status == "PENDING" ? (
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
            ) : listing.status == "APPROVED" ? (
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
            ) : listing.status == "REJECTED" ? (
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
            listing.landlordId !== userId ? (
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
                    key="delete"
                    type="primary"
                    style={{ width: "100%" }}
                    onClick={async () => {
                      await updateListingStatus(listing.id, "DELETED");
                      message.success("Listing deleted successfully");
                      navigate("/dashboard/landlord");
                    }}
                  >
                    Delete
                  </Button>
                </Col>
                <Col lg={2} xs={4} offset={1}>
                  <Button
                    key="edit"
                    type="primary"
                    style={{ width: "100%" }}
                    onClick={() => {
                      navigate("/listing/edit/" + listing.id);
                    }}
                  >
                    Edit
                  </Button>
                </Col>
              </>
            )
          )}
        </Row>
      </Paragraph>
    </Flex>
  );
};

export default ButtonsBottom;