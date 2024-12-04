require("dotenv-flow").config();
const prisma = require("../utils/db");

class UserService {
  async getAllUsers() {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  async getUsersByStatus(status) {
    try {
      const users = await prisma.user.findMany({
        where: {
          status: status,
        },
      });
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
}

module.exports = UserService;