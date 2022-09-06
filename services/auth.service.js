import { customException } from "../exceptions/exceptionResponse.js";
import { User } from "../models/User.js";
import { generateRefreshToken, generateTestToken, generateToken } from "../utils/tokenManager.js";

export class AuthService {
    static async register(email, password, res) {
        const userCreated = await User.findOne({ where: { email } });

        if (userCreated)
            throw new customException(400, "User already exists with this email");

        const user = User.build({ email, password });
        await user.save();

        const { accessToken, expiresIn } = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id, res);

        return { accessToken, expiresIn, refreshToken };
    }

    static async login (email, password, res) {
        const user = await User.findOne({ where: { email } });
        
        if (!user)
            throw new customException(404, "Invalid email or password");

        const passwordCompareResult = await user.comparePassword(password);

        if (!passwordCompareResult)
            throw new customException(404, "Invalid email or password");

        const { accessToken, expiresIn } = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id, res);

        return { accessToken, expiresIn, refreshToken };
    };

    static async testingLogin (email, password, res) {
        const user = await User.findOne({ where: { email } });
        
        if (!user)
            throw new customException(404, "Invalid email or password");

        const passwordCompareResult = await user.comparePassword(password);

        if (!passwordCompareResult)
            throw new customException(404, "Invalid email or password");

        const { accessToken, expiresIn } = generateTestToken(user.id);
        const refreshToken = generateRefreshToken(user.id, res);

        return { accessToken, expiresIn, refreshToken };
    };

    static async deleteAccount (id) {
        const user = await User.findOne({ where: { id } });

        if (!user)
            throw new customException(404, "Invalid user");

        await user.destroy();

        return true;
    };

    static async refreshToken (id) {
        const user = await User.findOne({ where: { id } });

        if (!user)
            throw new customException(404, "Invalid user");

        const { accessToken, expiresIn } = generateToken(id);
        return { accessToken, expiresIn };
    };

    static logout (res) {
        res.clearCookie("refreshToken");
    };
}