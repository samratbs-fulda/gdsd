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
    const [reload, setReload] = React.useState(false);
    const listingQuery = useQuery({
        queryKey: ["listings", { status }],
        queryFn: () => {
            return getReviewListings(status.toUpperCase());
        },
      });

      const handleReload = () => {
        setReload(!reload);
      };
    
      const listings = listingQuery.data || [];
    return (
        <Row gutter={16}>
            {listings.map((listing) =>{
                if(status === "pending"){
                    return <PendingCard listing={listing} onReload={handleReload} />;
                } else if(status === "approved"){
                    return <ApprovedCard listing={listing} onReload={handleReload} />;
                } else if(status === "rejected"){
                    return <RejectedCard listing={listing} onReload={handleReload} />;
                }
            })}
        </Row>
    );
};

ReviewListings.propTypes = {
    status: PropTypes.string,
};

export default ReviewListings;