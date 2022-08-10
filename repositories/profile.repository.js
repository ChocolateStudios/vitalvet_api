import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";

export class ProfileRepository {
    static async getProfileByUserId(userId) {
        return await Profile.findOne({
            where: { userId },
            include: [{
                model: User,
                as: "user",
                attributes: ["id", "email"]
            }],
            attributes: { exclude: ["userId"] }
        });
    }

    static async getAllProfiles() {
        return await Profile.findAll({
            include: [{
                model: User,
                as: "user",
                attributes: ["id", "email"]
            }],
            attributes: { exclude: ["userId"] }
        });
    }
}