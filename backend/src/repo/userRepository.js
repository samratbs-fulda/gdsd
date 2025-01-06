const prisma = require("../utils/db");
const { getEnumValue, UserStatusEnum, RoleEnum } = require("../utils/enumUtils");

class UserRepository {

    static async createNewUser(userData){
        const { role, username, firstname, lastname, email, password } = userData;
        const status = "ACTIVE";
        const userStatus = getEnumValue(UserStatusEnum, status);
        const userRole = getEnumValue(RoleEnum, role); 

        const result = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname,
                role: userRole,
                status: userStatus
            }
        });

        return result;
    }

    static async updateUserStatus(id, status){
        const userStatus = getEnumValue(UserStatusEnum, status);
        const result = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                status: userStatus,
            },
        });
        return result;
    }

    static async findUniqueBy(field, value){
        const result = await prisma.user.findUnique({
            where: {
                [field]: value,
            },
        });
        return result;
    }

    static async findManyBy(field, value){
        const result = await prisma.user.findMany({
            where: {
                [field]: value,
            },
        });
        return result;
    }
}

module.exports = UserRepository;