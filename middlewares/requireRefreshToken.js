import jwt from "jsonwebtoken";

export const requireRefreshToken = (req, res, next) => {
    try {
        // const refreshTokenCookie = req.cookies.refreshToken;
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) throw new Error("Not authorized");
        
        const { uid } = jwt.verify(refreshToken, process.env.JWT_REFRESH);

        req.uid = uid;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: error.message });
    }
}