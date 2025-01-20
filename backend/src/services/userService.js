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
      const user = await UserRepository.findUniqueBy("email", email);
      return user;
    } catch (error) {
      throw Error("Error fetching user:", error);
    }
  }

  async getUserByUsername(username) {
    try{
      const user = await UserRepository.findUniqueBy("username", username);
      return user;
    }catch(error){
      throw Error("Error fetching user:", error);
    }
  }

  async registerUser(userData) {
    try {
      const { role, email, password } = userData;

      // Validate email existance and constrains
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) throw Error("Email already in use.");
      if (role === "STUDENT" && !this.validateEmail(email))
        throw Error("Students must register with hs email.");

      userData.password = await this.hashPassword(password);
      const newUser = await UserRepository.createNewUser(userData);
      return newUser;
    } catch (error) {
      return error;
    }
  }

  async logUserIn(email, password) {
    try {
      const user = email.includes("@") ? await this.getUserByEmail(email) : await this.getUserByUsername(email);
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
      throw Error(error);
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

      const user = await prisma.user.findUnique({
        where: {
          id: +id,
        },
      });


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

  async updateUserStatus(id, status) {
    try {
      const updatedUser = await UserRepository.updateUserStatus(id, status);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw Error(error.message);
    }
  }

  async getUserProfile(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: { profile: true },
      });
  
      if (!user) throw new Error("User not found.");
  
      return {
        id: user.id,
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        username: user.username || "",
        role: user.role || "",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        age: user.profile?.age || "",
        gender: user.profile?.gender || "",
        nationality: user.profile?.nationality || "",
        phone: user.profile?.phone || "",
        bio: user.profile?.bio || "",
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }
  
  

  async updateUserProfile(id, data) {
    try {
      console.log("Updating Profile for User ID:", id);
      console.log("Received Data:", data);
      
      const formattedPhone = `${data.phone}`;
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          username: data.username ?? undefined,
          firstname: data.firstname ?? undefined,
          lastname: data.lastname ?? undefined,
          email: data.email ?? undefined,
          profile: {
            upsert: {
              create: {
                age: data.age ? Number(data.age) : null,
                gender: data.gender ?? "",
                nationality: data.nationality ?? "",
                phone: formattedPhone,
                bio: data.bio ?? "",
              },
              update: {
                age: data.age ? Number(data.age) : undefined,
                gender: data.gender ?? undefined,
                nationality: data.nationality ?? undefined,
                phone: formattedPhone,
                bio: data.bio ?? undefined,
              },
            },
          },
        },
        include: { profile: true },
      });
  
      console.log("Profile Updated Successfully:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }  
}  

module.exports = UserService;
