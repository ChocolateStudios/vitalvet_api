import { exceptionResponse } from "../exceptions/exceptionResponse.js";
import { AuthService } from "../services/auth.service.js";

export const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const tokenResponse = await AuthService.register(email, password, res);
        return res.status(201).json(tokenResponse);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const tokenResponse = await AuthService.login(email, password, res);
        return res.status(200).json(tokenResponse);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const testingLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const tokenResponse = await AuthService.testingLogin(email, password, res);
        return res.status(200).json(tokenResponse);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        await AuthService.deleteAccount(req.uid);
        return res.status(200).json({ message: "Account deleted" });
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const refreshToken = async (req, res) => {

    try {
        const tokenResponse = await AuthService.refreshToken(req.uid);
        return res.status(201).json(tokenResponse);
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