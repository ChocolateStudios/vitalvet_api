import { User } from "../models/User.js";

export class UserRepository {
    static async getUserById(userId) {
        return await User.findOne({ where: { id: userId } });
    }

    static async getUserByEmail(userEmail) {
        return await User.findOne({ where: { email: userEmail } });
    }
}