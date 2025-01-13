import React from "react";
import { Card, Col, Button } from "antd";
import Meta from "antd/es/card/Meta";
import PropTypes from "prop-types";
import { updateUserStatus } from "../../services/reviewContent/reviewUserService";

const UserCard = ({ user, onReload, status }) => {
    const statusValues = {
        active: ["Ban", "Delete"],
        banned: ["Unban", "Delete"],
        deleted: "Restore",
    }
    const statusUpdate = {
        Ban: "BANNED",
        Unban: "ACTIVE",
        Delete: "DELETED",
        Restore: "ACTIVE",
    }

    const buttons = statusValues[status];
    const button1 = buttons[0];
    const button2 = buttons[1];
    if(status === "deleted"){
        return(
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
                //     <img
                //         alt="listing"
                //         src={user.pfp}
                //         className="listing-image"
                //     />
                // }
                actions={[
                    <Button key='restore' type="primary"
                    onClick={async () => {
                        const newStatus = statusUpdate[statusValues[status]];
                        await updateUserStatus(user.id, newStatus);
                        onReload();
                        }}>
                        Restore
                    </Button>,
                ]}
            >
                <Meta title={user.username} description={user.role} />
                <p>{user.firstname}</p>
                <p>{user.lastname}</p>
            </Card>
        </Col>
        );
    }
    return (
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
                //     <img
                //         alt="listing"
                //         src={user.pfp}
                //         className="listing-image"
                //     />
                // }
                actions={[
                    <Button key={button1} type="primary"
                    onClick={async () => {
                        const newStatus = statusUpdate[button1];
                        await updateUserStatus(user.id, newStatus);
                        onReload();
                        }}>
                        {button1}
                    </Button>,
                    <Button key={button2} type="primary"
                    onClick={async () => {
                        const newStatus = statusUpdate[button2];
                        await updateUserStatus(user.id, newStatus);
                        onReload();
                        }}>
                        {button2}
                    </Button>,
                ]}
            >
                <Meta title={user.username} description={user.role} />
                <p>{user.firstname}</p>
                <p>{user.lastname}</p>
            </Card>
        </Col>
    );
};

UserCard.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        // pfp: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        firstname: PropTypes.string.isRequired,
        lastname: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
    }).isRequired,
    onReload: PropTypes.func.isRequired,
    status: PropTypes.string,
};

export default UserCard;
