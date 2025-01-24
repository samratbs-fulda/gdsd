import axios from "axios";
import { getEnvironment } from "../../utils/fetchEnvironment";

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

export const createGroup = async (creatorId) => {
    try {
        const response = await axios.post(`${apiUrl}/api/groups/create`, { userId: creatorId });
        return response.data.group;
    } catch (error) {
        console.error("Error creating group:", error);
        throw error;
    }
};

export const addGroupMember = async (groupId, userId) => {
    try {
        const response = await axios.post(`${apiUrl}/api/groups/sendInvitation`, { groupId, userId });
        return response.data.groupMember;
    } catch (error) {
        console.error("Error adding group member:", error);
        throw error;
    }
}

export const getGroups = async (userId) => {
    try {
        const response = await axios.get(`${apiUrl}/api/groups/${userId}`, {
            params: { userId: userId }
        });
        console.log("Groups:", response.data.groups);
        return response.data.groups;
    } catch (error) {
        console.error("Error fetching groups:", error);
        throw error;
    }
}

export const getGroupMembers = async (groupId) => {
    try {
        const response = await axios.get(`${apiUrl}/api/groups/members/${groupId}`, {
            params: { groupId: groupId }
        });
        return response.data.groupMembers;
    } catch (error) {
        console.error("Error fetching members:", error);
        throw error;
    }
}
