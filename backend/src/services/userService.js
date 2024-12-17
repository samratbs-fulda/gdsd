require("dotenv-flow").config();
const prisma = require("../utils/db");
const UserRepository = require("../repo/userRepository");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class UserService {
  validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?hs-fulda\.de$/;
    return regex.test(email);
  }

  async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      console.error("Error hashing password:", error);
      throw Error("Error hashing password!");
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await UserRepository.findUniqueBy('email', email);
      return user;
    } catch (error) {
      throw Error("Error fetching user:", error);
    }
  }

  async registerUser(userData){
    try{
      const { role, email, password } = userData;

      // Validate email existance and constrains
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) throw Error("Email already in use.");
      if (role === "STUDENT" && !this.validateEmail(email)) throw Error("Students must register with hs email.")
      
      userData.password = await this.hashPassword(password);
      const newUser = await UserRepository.createNewUser(userData);
      return newUser;
    }catch(error){
      return error;
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
      return error;
    }
  }

  async getAllUsers() {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return error;
    }
  }

  async getUserById(id) {
    try {
      const user = await UserRepository.findUniqueBy("id", id);
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return error;
    }
  }

  async getUsersByStatus(status) {
    try {
      const users = await UserRepository.findManyBy("status", status);
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return error;
    }
  }
}

module.exports = UserService;
