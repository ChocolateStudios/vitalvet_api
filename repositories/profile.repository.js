import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";

export class ProfileRepository {
    static async createProfile(name, lastname, birthday, picture, admin, college, review, userId) {
        let profile = Profile.build({ name, lastname, birthday, picture, admin, college, review, userId });
        await profile.save();
        return profile;
    }

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