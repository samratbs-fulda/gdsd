require("dotenv-flow").config();
const GroupRepository = require("../repo/groupRepository");

class GroupService {
  async getGroupsByUserId(userId){
    try {
      const groups = await GroupRepository.findGroupsByUserId(parseInt(userId));
      return groups;
    } catch (error) {
      throw Error("Error fetching groups:", error);
    }
  }

  async getMembersByGroupId(groupId){
    try {
      const members = await GroupRepository.findMembersByGroupId(parseInt(groupId));
      return members;
    } catch (error) {
      throw Error("Error fetching group members:", error);
    }
  }

  async createGroup(creatorId){
    try {
      const newGroup = await GroupRepository.createGroup(parseInt(creatorId));
      await GroupRepository.addCreatorToGroup(newGroup.id, parseInt(creatorId));
      return newGroup;
    } catch (error) {
      throw Error("Error creating group:", error);
    }
  }

  async addStudentToGroup(groupId, userId){
    try {
      const newGroupMember = await GroupRepository.addStudentToGroup(parseInt(groupId), parseInt(userId));
      return newGroupMember;
    } catch (error) {
      throw Error("Error adding student to group:", error);
    }
  }

  async acceptGroupInvitation(groupId, userId){
    try {
      const groupMember = await GroupRepository.updateMemberStatus(parseInt(groupId), parseInt(userId), "ACCEPTED");
      return groupMember;
    } catch (error) {
      throw Error("Error student accepting group invitation:", error);
    }
  }

  async removeStudentFromGroup(groupId, userId){
    try {
      const groupMember = await GroupRepository.removeStudentFromGroup(parseInt(groupId), parseInt(userId));
      return groupMember;
    } catch (error) {
      throw Error("Error student accepting group invitation:", error);
    }
  }
}  

module.exports = GroupService;
