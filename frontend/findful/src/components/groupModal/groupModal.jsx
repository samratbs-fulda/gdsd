import React, { useEffect } from 'react';
import { Button, Form, Modal, Select } from 'antd';
import PropTypes from 'prop-types';
import { createGroup, addGroupMember, getGroups, getGroupMembers } from '../../services/groups/groupService';
import { getReviewUsers } from '../../services/reviewContent/reviewUserService';
import { useQuery } from '@tanstack/react-query';

const GroupModal = ({ isVisible, onCancel, onClose, userId }) => {
    const [loading, setLoading] = React.useState(true);
    const [usernames, setUsernames] = React.useState([]);

    const usersQuery = useQuery({
        queryKey: ['users'],
        queryFn: () => {
            return getReviewUsers('ACTIVE');
        },
    });

    const users = usersQuery.data || [];

    const loadUsernames = async () => {
        setLoading(true);

        // Get all usernames
        // const response = await fetch('https://jsonplaceholder.typicode.com/users');
        setUsernames(users.filter(user => user.id !== userId && user.role === 'STUDENT').map(user => user.username));
        setLoading(false);
    };

    useEffect(() => {
        if (isVisible) {
            loadUsernames();
        }
    }, [isVisible]);

    const createNewGroup = async (selectedUsernames) => {
        setLoading(true);
        // Create group service call
        await createGroup(userId);
        const groups = await getGroups(userId);
        const newGroup = groups.pop();
        console.log(newGroup);
        // The get usernames should include the users id to call the add member endpoint
        selectedUsernames.map(async username => {
            const user = users.find(user => user.username === username);
            await addGroupMember(newGroup.id, user.id);
        });
        const members = await getGroupMembers(newGroup.id)
        console.log('Members:', members);
        setLoading(false);
        onClose();
    };

    return (
        <>
            <Modal
                title={<p>Create a new group</p>}
                footer={
                    <Button type="primary" form="groupForm" key="submit" htmlType="submit">
                        Create
                    </Button>
                }
                loading={loading}
                open={isVisible}
                onCancel={onCancel}
            >
                <Form
                    id="groupForm"
                    layout="vertical"
                    onFinish={(values) => {
                        createNewGroup(values.groupMembers);
                    }}>
                    <Form.Item label="Group Members" name="groupMembers">
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
    userId: PropTypes.number.isRequired,
};

export default GroupModal;