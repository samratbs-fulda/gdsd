import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'antd';
import { useQuery } from "@tanstack/react-query";
import { getReviewUsers } from "../../services/reviewContent/reviewUserService";
import UserCard from "../cards/reviewUserCard";

const ReviewUsers = ({ status }) => {
    const [reload, setReload] = React.useState(false);
    const handleReload = () => {
        setReload(!reload);
      };
      
    const usersQuery = useQuery({
        queryKey: ["users", { status }],
        queryFn: () => {
            return getReviewUsers(status.toUpperCase());
        },
      });
    
      const users = usersQuery.data || [];
        // change views depending on status
    return (
        <Row gutter={16}>
        {users.map((user) => (
            <UserCard key={user.id} user={user} onReload={handleReload} status={status} />
        ))}
        </Row>
    );
};

ReviewUsers.propTypes = {
    status: PropTypes.string,
};

export default ReviewUsers;