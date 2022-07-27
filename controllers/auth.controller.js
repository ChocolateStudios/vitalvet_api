import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import ExceptionResponse from "../exceptions/exceptionResponse.js";

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
        const token = jwt.sign({ uid: user.id }, process.env.JWT_SECRET);

        return res.json({ token });
    } catch (error) {
        console.log(error);
        const { code, message } = ExceptionResponse(error);
        return res.status(code).json(message);
    }
};