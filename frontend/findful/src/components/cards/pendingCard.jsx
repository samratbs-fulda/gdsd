import React from "react";
import { Card, Col, Button } from "antd";
import Meta from "antd/es/card/Meta";
import PropTypes from "prop-types";
import { updateListingStatus } from "../../services/reviewContent/reviewListingService";
import { useNavigate } from "react-router-dom";

const PendingCard = ({ listing, status, onReload }) => {
    const [loading, setLoading] = React.useState(false);

    const handleUpdate = async (newStatus) => {
        setLoading(true);
        try {
            await updateListingStatus(listing.id, newStatus);
            onReload();
        } catch (error) {
            console.error("An error occurred: ", error);
        } /*finally{
            setLoading(false);
        }*/
    };

    const navigate = useNavigate();
    if (status === "pending"){
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
                    actions={[
                                <Button key="view-details" type="primary"
                                onClick={async () => {
                                    navigate(`/listing/${listing.id}`);
                                }}>
                                    View Details
                                </Button>
                    ]}
                >
                    <Meta title={listing.title} description={listing.type} />
                    <p>Rent: ${listing.warmRent}</p>
                    <p>Postcode: {listing.postalCode}</p>
                </Card>
            </Col>
        );
    }
    const statusValues = {
        rejected: "Approved",
        approved: "Rejected",
    };
    const statusText = {
        rejected: "Approve",
        approved: "Reject",
    }
    const text = statusText[status];
    const newStatus = statusValues[status].toUpperCase();
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

                actions={[  <Button key={status} type="primary"
                            onClick={async () => {
                                await handleUpdate(newStatus);
                                }
                            }
                            loading={loading}>
                                {text} 
                            </Button>,
                            <Button key="view-details" type="primary"
                            onClick={async () => {
                                navigate(`/listing/${listing.id}`);
                            }}>
                                Details
                            </Button>
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
    status: PropTypes.string.isRequired,
    onReload: PropTypes.func.isRequired,
};

export default PendingCard;
