import React, { useEffect } from 'react';
import { Button, Form, Modal, Select } from 'antd';
import PropTypes from 'prop-types';
import { createGroup, addGroupMember } from '../../services/groups/groups';

const GroupModal = ({ isVisible, onCancel, onClose, userId }) => {
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

    const createNewGroup = async () => {
        setLoading(true);
        // Create group service call
        await createGroup(userId);
        // The get usernames should include the users id to call the add member endpoint
        // const selectedUsernames = form.getFieldValue('groupMembers');
        // for (const username of selectedUsernames) {
        //     await addGroupMember(username);
        // }
        setLoading(false);
        onClose();
    };

    return (
        <>
            <Modal
                title={<p>Create a new group</p>}
                footer={
                    <Button type="primary" onClick={createNewGroup}>
                        Create
                    </Button>
                }
                loading={loading}
                open={isVisible}
                onCancel={onCancel}
            >
                <Form
                    layout="vertical"
                    onFinish={createNewGroup}>
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