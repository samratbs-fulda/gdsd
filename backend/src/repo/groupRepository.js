const prisma = require("../utils/db");
const { getEnumValue, GroupMemberStatusEnum } = require("../utils/enumUtils");

class GroupRepository {

  static async createGroup(creatorId) {
    return await prisma.group.create({
      data: {
        creator: {
          connect: { id: creatorId },
        }
      },
    });
  }

  static async addCreatorToGroup(groupId, userId) {
    return await prisma.groupMember.create({
      data: {
        studentId: userId,
        groupId: groupId,
        status: GroupMemberStatusEnum.ACCEPTED,
      },
    });
  }

  static async addStudentToGroup(groupId, studentId) {
    return await prisma.groupMember.create({
      data: {
        studentId: studentId,
        groupId: groupId,
        status: GroupMemberStatusEnum.PENDING,
      },
    });
  }

  static async removeStudentFromGroup(groupId, studentId) {
    return await prisma.groupMember.delete({
      where: {
        groupId_studentId: {
          groupId: groupId,
          studentId: studentId,
        },
      },
    });
  }

  static async updateMemberStatus(groupId, studentId, status) {
    const memberStatus = getEnumValue(GroupMemberStatusEnum, status);
    
    return await prisma.groupMember.update({
      where: {
        groupId_studentId: {
          groupId: groupId,
          studentId: studentId,
        },
      },
      data: {
        status: memberStatus,
      },
    });
  }

  static async findGroupById(groupId) {
    return await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });
  }

  static async findGroupsByUserId(userId) {
    return await prisma.group.findMany({
      where: {
        members: {
          some: {
            studentId: userId,
          },
        },
      }
    });
  }

  static async findMembersByGroupId(groupId) {
    return await prisma.groupMember.findMany({
      where: {
        groupId: groupId,
      }
    });
  }
}

module.exports = GroupRepository;