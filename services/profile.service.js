import { customException } from "../exceptions/exceptionResponse.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { ProfileRepository } from "../repositories/profile.repository.js";

export class ProfileService {
    static async createProfile(body, user_id) {
        const user = await User.findOne({ where: { id: user_id } });

        if (!user)
            throw new customException(404, "Invalid user");

        const profileCreated = await Profile.findOne({ where: { user_id } });

        if (profileCreated)
            throw new customException(400, "Profile already exists for this user");

        const { name, lastname, birthday, picture, college, review } = body;
        const admin = false;

        const profile = Profile.build({ name, lastname, birthday, picture, admin, college, review, user_id });
        await profile.save();

        return {
            id: profile.id,
            name: profile.name,
            lastname: profile.lastname,
            birthday: profile.birthday,
            picture: profile.picture,
            admin: profile.admin,
            college: profile.college,
            review: profile.review,
            user: {
                id: user.id,
                email: user.email
            }
        };
    }

    static async updateProfile(body, user_id) {
        const user = await User.findOne({ where: { id: user_id } });

        if (!user)
            throw new customException(404, "Invalid user");

        const profile = await ProfileRepository.getProfileByUserId(user_id);

        if (!profile)
            throw new customException(404, "Profile not found for this user");

        const { name, lastname, birthday, picture, college, review } = body;
        const admin = profile.admin;

        profile.set({ name, lastname, birthday, picture, admin, college, review });
        await profile.save();

        return profile;
    }

    static async deleteProfile(user_id) {
        const user = await User.findOne({ where: { id: user_id } });

        if (!user)
            throw new customException(404, "Invalid user");

        const profile = await ProfileRepository.getProfileByUserId(user_id);

        if (!profile)
            throw new customException(404, "Profile not found for this user");

        await profile.destroy();

        return profile;
    }

    static async getProfile(user_id) {
        const user = await User.findOne({ where: { id: user_id } });

        if (!user)
            throw new customException(404, "Invalid user");

        const profile = await ProfileRepository.getProfileByUserId(user_id);

        if (!profile)
            throw new customException(404, "Profile not found for this user");

        return profile;
    }

    static async getAllProfilesIfAdmin(user_id) {
        const user = await User.findOne({ where: { id: user_id } });

        if (!user)
            throw new customException(404, "Invalid user");

        const profile = await Profile.findOne({ where: { user_id } });

        if (!profile)
            throw new customException(404, "Profile not found for this user");

        if (!profile.admin)
            throw new customException(403, "You are not authorized to do this action");

        const profiles = await ProfileRepository.getAllProfiles();

        return profiles;
    }
}