import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Row } from 'antd';
import { useQuery } from "@tanstack/react-query";
import { getReviewUsers } from "../../services/reviewContent/reviewUserService";
import Meta from 'antd/es/card/Meta';

const ReviewUsers = ({ status }) => {
    const usersQuery = useQuery({
        queryKey: ["users", { status }],
        queryFn: () => {
            return getReviewUsers(status.toUpperCase());
        },
      });
    
      const users = usersQuery.data || [];
    return (
        <Row gutter={16}>
        {users.map((user) => (
                <Col
                  span={24}
                  sm={12}
                  md={8}
                  key={user.id}
                  style={{ marginBottom: 16 }}
                >
                  <Card
                    hoverable
                    // cover={
                    //   <img
                    //     alt="listing"
                    //     src={user.img}
                    //     className="listing-image"
                    //   />
                    // }
                    actions={[
                        <Button key="view-details" type="primary" href={"profile/" + user.id}>
                          View Profile
                        </Button>,
                    ]}
                  >
                    <Meta title={user.firstname} description={user.lastname} />
                  </Card>
                </Col>
              ))}
        </Row>
    );
};

ReviewUsers.propTypes = {
    status: PropTypes.string,
};

export default ReviewUsers;