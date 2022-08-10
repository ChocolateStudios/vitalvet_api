import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";

export class ProfileRepository {
    static async getProfileByUserId(user_id) {
        return await Profile.findOne({
            where: { user_id },
            include: [{
                model: User,
                as: "user",
                attributes: ["id", "email"]
            }],
            attributes: { exclude: ["user_id"] }
        });
    }

    static async getAllProfiles() {
        return await Profile.findAll({
            include: [{
                model: User,
                as: "user",
                attributes: ["id", "email"]
            }],
            attributes: { exclude: ["user_id"] }
        });
    }
}