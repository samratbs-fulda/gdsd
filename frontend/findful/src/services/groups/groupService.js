import axios from "axios";
import { getEnvironment } from "../../utils/fetchEnvironment";
import { getUserById } from "../login/loginService"; 

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

export const createGroup = async (creatorId) => {
  try {
    const response = await axios.post(`${apiUrl}/api/groups/create`, { userId: creatorId });
    return response.data.newGroup;
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
};

export const getGroups = async (userId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/groups/${userId}`);
    return response.data.groups;
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }
};

export const getGroupMembers = async (groupId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/groups/members/${groupId}`);
    return response.data.groupMembers; 
  } catch (error) {
    console.error("Error fetching group members:", error);
    throw error;
  }
};

export const acceptInvitation = async (groupId, userId) => {
  try {
    const response = await axios.patch(`${apiUrl}/api/groups/acceptInvitation`, {
      groupId,
      userId,
    });
    return response.data.groupMember;
  } catch (error) {
    console.error("Error accepting invitation:", error);
    throw error;
  }
};

export const denyInvitation = async (groupId, userId) => {
  try {
    const response = await axios.post(`${apiUrl}/api/groups/denyInvitation`, {
      groupId,
      userId,
    });
    return response.data.groupMember;
  } catch (error) {
    console.error("Error denying invitation:", error);
    throw error;
  }
};

export const leaveGroup = async (groupId, userId) => {
  try {
    const response = await axios.delete(`${apiUrl}/api/groups/removeStudent`, {
      data: { groupId, userId },
    });
    return response.data.groupMember;
  } catch (error) {
    console.error("Error leaving group:", error);
    throw error;
  }
};

export const getGroupsDetailed = async (userId) => {
  const basicGroups = await getGroups(userId);
  const userCache = new Map();
  for (let group of basicGroups) {
    const members = await getGroupMembers(group.id);

    const participants = [];
    for (let m of members) {

      if (!userCache.has(m.studentId)) {
        const userData = await getUserById(m.studentId);
        userCache.set(m.studentId, userData); 
      }
      const foundUser = userCache.get(m.studentId);
      participants.push({
        id: m.studentId,
        username: foundUser.username || "UnknownUser",
        status: m.status,
      });
    }

    group.participants = participants;
  }

  return basicGroups;
};
