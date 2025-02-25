import React from 'react';
import PropTypes from 'prop-types';
import { getReviewListings } from "../../services/reviewContent/reviewListingService";
import { getListingsByLandlordId } from '../../services/landlord/listingsByLandlord';
import { useQuery } from "@tanstack/react-query";
import { Row } from 'antd';
import { Col, Card, Button } from 'antd';
import Meta from 'antd/es/card/Meta';
import { useAuth } from '../../services/authContext';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';

const ReviewListings = ({ status }) => {
    const { user } = useAuth();
    const role = user.role;
    const listingQuery = useQuery({
        queryKey: ["listings", { status }],
        queryFn: () => {
          const landlordId = user.id;
          if(role === "MODERATOR"){
            return getReviewListings(status.toUpperCase());
          } else if (role === "LANDLORD"){
            return getListingsByLandlordId(landlordId, status.toUpperCase());
          }
        },
    });
    
    const listings = listingQuery.data || [];
    return (
      <Row gutter={[16, 16]}>
              {listings.map((listing) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  key={listing.id}
                >
                  <Card
                    hoverable
                    cover={
                      <div style={{ height: 200, overflow: 'hidden' }}>
                        <img
                          alt="listing"
                          src={listing.img}
                          style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    }
                    actions={[
                      role === "LANDLORD" && (
                        <Button key="edit-listing" type="primary" icon={<EditOutlined />} href={"/listing/edit/" + listing.id} />
                      ),
                      <Button key="view-details" type="primary" icon={<EyeOutlined />} href={"/listing/" + listing.id} />,
                      ].filter(Boolean)}
                  >
                    <Meta title={listing.title} description={listing.type} />
                    <div style={{ marginTop: 16 }}>
                      <p>Rent: {listing.warmRent}€</p>
                      <p>Size: {listing.size} sq.m</p>
                      <p>Rooms Available: {listing.freeRooms}</p>
                      <p>
                        Address: {listing.street} {listing.houseNumber},{" "}
                        {listing.postalCode}
                      </p>
                      <p>Distance from University: {listing.distanceFromUni} km</p>
                    </div>
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