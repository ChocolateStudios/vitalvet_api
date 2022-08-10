import { exceptionResponse } from "../exceptions/exceptionResponse.js";
import { AuthService } from "../services/auth.service.js";

export const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { token, expiresIn } = await AuthService.register(email, password, res);
        return res.status(201).json({ token, expiresIn });
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { token, expiresIn } = await AuthService.login(email, password, res);
        return res.status(200).json({ token, expiresIn });
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        AuthService.deleteAccount(req.uid);
        return res.status(200).json({ message: "Account deleted" });
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const refreshToken = (req, res) => {

    try {
        const { token, expiresIn } = AuthService.refreshToken(req.uid);
        return res.status(200).json({ token, expiresIn });
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const logout = (req, res) => {
    try {
        AuthService.logout(res);
        return res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};