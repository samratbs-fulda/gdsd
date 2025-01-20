const prisma = require("../utils/db");

class ProfileRepository {
  static async createNewProfile(profileData) {
    const { userId, age, gender, nationality, phone, bio } = profileData;
    const result = await prisma.profile.create({
      data: {
        userId,
        age: age || 0, // Default values
        gender: gender || "Not Specified",
        nationality: nationality || "Unknown",
        phone: phone || "",
        bio: bio || "",
      },
    });
    return result;
  }

  static async findProfileByUserId(userId) {
    return await prisma.profile.findUnique({
      where: { userId: parseInt(userId) },
    });
  }

  static async updateProfile(userId, profileData) {
    return await prisma.profile.update({
      where: { userId: parseInt(userId) },
      data: profileData,
    });
  }
}

module.exports = ProfileRepository;
