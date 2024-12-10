require("dotenv-flow").config();
const prisma = require("../utils/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class UserService {
  validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?hs-fulda\.de$/;
    return regex.test(email);
  }

  async hashPassword(password) {
    try{
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    }catch(error){
      console.error('Error hashing password:', error);
      throw Error('Error hashing password!');
    }
  }
  
  async createUser(user) {
    user.password = await this.hashPassword(user.password);
    console.log(user);
    try {
      const newUser = await prisma.user.create({
        data: user,
      });
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  async logUserIn(email, password) {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) {
        throw Error("User not found!");
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw Error("Password incorrect!");
      }
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

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