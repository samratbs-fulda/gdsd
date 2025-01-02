/* eslint-disable react/jsx-key */
import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from "@tanstack/react-query";
import { getReviewListings } from "../../services/reviewContent/reviewListingService";
import { Row } from 'antd';
import PendingCard from '../cards/pendingCard';
import ApprovedCard from '../cards/approvedCard';
import RejectedCard from '../cards/rejectedCard';

const ReviewListings = ({ status }) => {
    const listingQuery = useQuery({
        queryKey: ["listings", { status }],
        queryFn: () => {
            return getReviewListings(status.toUpperCase());
        },
      });
    
      const listings = listingQuery.data || [];
      console.log(status);
    return (
        <Row gutter={16}>
            {listings.map((listing) =>{
                if(status === "pending"){
                    return <PendingCard listing={listing} />;
                } else if(status === "approved"){
                    return <ApprovedCard listing={listing} />;
                } else if(status === "rejected"){
                    return <RejectedCard listing={listing} />;
                }
            })}
        </Row>
    );
};

ReviewListings.propTypes = {
    status: PropTypes.string,
};

export default ReviewListings;