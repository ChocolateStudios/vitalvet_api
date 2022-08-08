import { customException } from "../exceptions/exceptionResponse.js";
import User from "../models/User.js";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";

export class AuthService {
    static async register(email, password, res) {
        const user = User.build({ email, password });
        await user.save();

        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);

        return { token, expiresIn };
    }

    static async login (email, password, res) {
        const user = await User.findOne({ where: { email } });
        
        if (!user)
            throw new customException(404, "Invalid email or password");

        const passwordCompareResult = await user.comparePassword(password);

        if (!passwordCompareResult)
            throw new customException(404, "Invalid email or password");

        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);

        return { token, expiresIn };
    };

    static refreshToken (uid) {
        const { token, expiresIn } = generateToken(uid);
        
        return { token, expiresIn };
    };

    static logout (res) {
        res.clearCookie("refreshToken");
    };

    static async deleteAccount (id) {
        const user = await User.findOne({ where: { id } });

        if (!user)
            throw new customException(404, "Invalid user");

        await User.destroy({ where: { id } });

        return true;
    };
}