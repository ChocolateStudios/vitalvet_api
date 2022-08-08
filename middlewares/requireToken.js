import jwt from "jsonwebtoken";

export const requireToken = (req, res, next) => {

    try {
        // console.log('Headers');
        // console.log(req.headers);
        let token = req.headers?.authorization

        if (!token) throw new Error("Not authorized");

        token = token.split(" ")[1];
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;
            
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: error.message });
    }
}