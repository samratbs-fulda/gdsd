import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from "@tanstack/react-query";
import { getReviewListings } from "../../services/reviewContent/reviewListingService";

const ReviewListings = ({ status }) => {
    const listingQuery = useQuery({
        queryKey: ["listings", { status }],
        queryFn: () => {
            return getReviewListings(status.toUpperCase());
        },
      });
    
      const listings = listingQuery.data || [];
      // change views depending on status
    return (
        <div>
        {listings.map((listing) => (
            <div key={listing.id}>
            <p>{listing.title + ' - ' + listing.type}</p>
            </div>
        ))}
        </div>
    );
};

ReviewListings.propTypes = {
    status: PropTypes.string,
};

export default ReviewListings;