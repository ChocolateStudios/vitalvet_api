import { customException } from "../exceptions/exceptionResponse.js";
import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";
import { ProfileRepository } from "../repositories/profile.repository.js";

export class ProfileService {
    static async createProfile(body, userId) {
        const user = await User.findOne({ where: { id: userId } });

        if (!user)
            throw new customException(404, "Invalid user");

        const profileCreated = await Profile.findOne({ where: { userId } });

        if (profileCreated)
            throw new customException(400, "Profile already exists for this user");

        const { name, lastname, birthday, picture, college, review } = body;
        const admin = false;

        let profile = Profile.build({ name, lastname, birthday, picture, admin, college, review, userId });
        await profile.save();

        return {
            id: profile.id,
            name: profile.name,
            lastname: profile.lastname,
            birthday: profile.birthday,
            picture: profile.picture ? profile.picture : null,
            admin: profile.admin,
            college: profile.college,
            review: profile.review,
            user: {
                id: user.id,
                email: user.email
            }
        };
    }

    static async updateProfile(body, userId) {
        const user = await User.findOne({ where: { id: userId } });

        if (!user)
            throw new customException(404, "Invalid user");

        const profile = await ProfileRepository.getProfileByUserId(userId);

        if (!profile)
            throw new customException(404, "Profile not found for this user");

        const { name, lastname, birthday, college, review } = body;
        const admin = profile.admin;
        const picture = body.picture ? body.picture : null;

        profile.set({ name, lastname, birthday, picture, college, review });
        await profile.save();

        return profile;
    }

    static async deleteProfile(userId) {
        const user = await User.findOne({ where: { id: userId } });

        if (!user)
            throw new customException(404, "Invalid user");

        const profile = await ProfileRepository.getProfileByUserId(userId);

        if (!profile)
            throw new customException(404, "Profile not found for this user");

        await profile.destroy();

        return profile;
    }

    static async getProfile(userId) {
        const user = await User.findOne({ where: { id: userId } });

        if (!user)
            throw new customException(404, "Invalid user");

        const profile = await ProfileRepository.getProfileByUserId(userId);

        if (!profile)
            throw new customException(404, "Profile not found for this user");

        return profile;
    }

    static async getAllProfilesIfAdmin(userId) {
        const user = await User.findOne({ where: { id: userId } });

        if (!user)
            throw new customException(404, "Invalid user");

        const profile = await Profile.findOne({ where: { userId } });

        if (!profile)
            throw new customException(404, "Profile not found for this user");

        if (!profile.admin)
            throw new customException(403, "You are not authorized to do this action");

        const profiles = await ProfileRepository.getAllProfiles();

        return profiles;
    }
}