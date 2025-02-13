import React from 'react';
import PropTypes from 'prop-types';
import { getReviewListings } from "../../services/reviewContent/reviewListingService";
import { getListingsByLandlordId } from '../../services/landlord/listingsByLandlord';
import { useQuery } from "@tanstack/react-query";
import { Row } from 'antd';
import { Col, Card, Button } from 'antd';
import Meta from 'antd/es/card/Meta';
import { useAuth } from '../../services/authContext';

const ReviewListings = ({ status }) => {
    const { user } = useAuth();
    const listingQuery = useQuery({
        queryKey: ["listings", { status }],
        queryFn: () => {
          const landlordId = user.id;
          const role = user.role;
          if(role === "MODERATOR"){
            return getReviewListings(status.toUpperCase());
          } else if (role === "LANDLORD"){
            return getListingsByLandlordId(landlordId, status.toUpperCase());
          }
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
                        <Button key="edit-listing" type="primary" href={"/listing/edit/" + listing.id}>
                          Edit
                        </Button>,
                        <Button key="view-details" type="primary" href={"/listing/" + listing.id}>
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