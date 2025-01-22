import React, { useEffect } from 'react';
import { Button, Form, Modal, Select } from 'antd';
import PropTypes from 'prop-types';

const GroupModal = ({ isVisible, onCancel, onClose }) => {
    const [loading, setLoading] = React.useState(true);
    const [usernames, setUsernames] = React.useState([]);

    const loadUsernames = async () => {
        setLoading(true);

        // Get all usernames
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        setUsernames(data.map(user => user.username));
        setLoading(false);
    };

    useEffect(() => {
        if (isVisible) {
            loadUsernames();
        }
    }, [isVisible]);

    const createGroup = async () => {
        setLoading(true);
        // Create group service call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        onClose();
    };

    return (
        <>
            <Modal
                title={<p>Create a new group</p>}
                footer={
                    <Button type="primary" onClick={createGroup}>
                        Create
                    </Button>
                }
                loading={loading}
                open={isVisible}
                onCancel={onCancel}
            >
                <Form
                    layout="vertical"
                    onFinish={createGroup}>
                    <Form.Item label="Group Members">
                        <Select
                            mode="multiple"
                            options={usernames.map(username => ({ value: username, label: username }))}
                            maxCount={6}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

GroupModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default GroupModal;