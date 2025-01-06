import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from "@tanstack/react-query";
import { getReviewListings } from "../../services/reviewContent/reviewListingService";
import { Row } from 'antd';
import PendingCard from '../cards/pendingCard';

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
                return <PendingCard key={listing.id} listing={listing} status={status} onReload={handleReload} />;
            })}
        </Row>
    );
};

ReviewListings.propTypes = {
    status: PropTypes.string,
};

export default ReviewListings;