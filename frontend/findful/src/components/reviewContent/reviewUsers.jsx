import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from "@tanstack/react-query";
import { getReviewUsers } from "../../services/reviewContent/reviewUserService";

const ReviewUsers = ({ status }) => {
    const usersQuery = useQuery({
        queryKey: ["users", { status }],
        queryFn: () => {
            return getReviewUsers(status.toUpperCase());
        },
      });
    
      const users = usersQuery.data || [];
        // change views depending on status
    return (
        <div>
        {users.map((user) => (
            <div key={user.id}>
            <p>{user.firstname + ' ' + user.lastname}</p>
            </div>
        ))}
        </div>
    );
};

ReviewUsers.propTypes = {
    status: PropTypes.string,
};

export default ReviewUsers;