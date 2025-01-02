import React from "react";
import { Card, Col, Button } from "antd";
import Meta from "antd/es/card/Meta";
import PropTypes from "prop-types";
import { updateListingStatus } from "../../services/reviewContent/reviewListingService";

const PendingCard = ({ listing, onReload }) => {
    return (
        <Col
            span={24}
            sm={12}
            md={8}
            key={listing.id}
            style={{ marginBottom: 16 }}
        >
            <Card
                hoverable
                cover={
                    <img
                        alt="listing"
                        src={listing.img}
                        className="listing-image"
                    />
                }
                actions={[  <Button key="approve" type="primary"
                            onClick={async () => {
                                await updateListingStatus(listing.id, "APPROVED");
                                onReload();}}>
                                Approve 
                            </Button>,
                            <Button key="view-details" type="primary">
                                View Details
                            </Button>,
                            <Button key="reject" type="primary"
                            onClick={async () => {
                                await updateListingStatus(listing.id, "REJECTED");
                                onReload();}}>
                                Reject
                            </Button>,
                ]}
            >
                <Meta title={listing.title} description={listing.type} />
                <p>Rent: ${listing.warmRent}</p>
                <p>Postcode: {listing.postalCode}</p>
            </Card>
        </Col>
    );
};

PendingCard.propTypes = {
    listing: PropTypes.shape({
        id: PropTypes.number.isRequired,
        img: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        warmRent: PropTypes.number.isRequired,
        postalCode: PropTypes.string.isRequired,
    }).isRequired,
    onReload: PropTypes.func.isRequired,
};

export default PendingCard;
