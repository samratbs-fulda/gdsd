import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from "@tanstack/react-query";
import { getReviewListings } from "../../services/reviewContent/reviewListingService";
import { Row } from 'antd';
import { Col, Card, Button } from 'antd';
import Meta from 'antd/es/card/Meta';

const ReviewListings = ({ status }) => {
    const listingQuery = useQuery({
        queryKey: ["listings", { status }],
        queryFn: () => {
            return getReviewListings(status.toUpperCase());
        },
    });
    
    const listings = listingQuery.data || [];
    return (
        <Row gutter={16}>
            {listings.map((listing) => (
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
                        <Button key="view-details" type="primary" href={"listing/" + listing.id}>
                          View Details
                        </Button>,
                    ]}
                  >
                    <Meta title={listing.title} description={listing.type} />
                    <p>Rent: ${listing.warmRent}</p>
                    <p>Size: {listing.size} sq.m</p>
                    <p>Rooms Available: {listing.freeRooms}</p>
                    <p>Address: {listing.street} {listing.houseNumber}, {listing.postalCode}</p>
                  </Card>
                </Col>
              ))}
        </Row>
    );
};

ReviewListings.propTypes = {
    status: PropTypes.string,
};

export default ReviewListings;