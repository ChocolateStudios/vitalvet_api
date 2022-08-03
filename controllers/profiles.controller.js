import Profile from '../models/Profile.js';

export const createProfile = async (req, res) => {
    const { name, lastname, birthday, picture, admin, user_id } = req.body;
    try {
        const profile = new Profile({ name, lastname, birthday, picture, admin, user_id });
        await profile.save();

        return res.status(201).json({ name, lastname, birthday, picture, admin, user_id });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'server error' });
    }
}