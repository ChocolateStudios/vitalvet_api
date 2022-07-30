import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import ExceptionResponse from "../exceptions/exceptionResponse.js";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";

export const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = new User({ email, password });
        await user.save();

        // jwt token

        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        const { code, message } = ExceptionResponse(error);
        return res.status(code).json(message);
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user)
            return res.status(404).json({ message: "Invalid email or password" });

        const passwordCompareResult = await user.comparePassword(password);

        if (!passwordCompareResult)
            return res.status(404).json({ message: "Invalid email or password" });

        // Generar el token JWT
        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);

        return res.json({ token, expiresIn });
    } catch (error) {
        console.log(error);
        const { code, message } = ExceptionResponse(error);
        return res.status(code).json(message);
    }
};

export const infoUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.uid } });
        return res.json({ user });
    } catch (error) {

    }
}

export const refreshToken = (req, res) => {

    try {
        const refreshTokenCookie = req.cookies.refreshToken;
        if (!refreshTokenCookie) throw new Error("Not authorized");

        const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
        const { token, expiresIn } = generateToken(uid);
        return res.json({ token, expiresIn });

    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: error.message });
    }
}

export const logout = (req, res) => {
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logout successfully" });
}