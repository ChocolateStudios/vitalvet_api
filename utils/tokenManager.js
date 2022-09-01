import jwt from "jsonwebtoken";

export const generateToken = (uid) => {
    const expiresIn = 60 * 15; // 15 minutes

    try {
        const accessToken = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn });
        return { accessToken, expiresIn };
    } catch (error) {
        console.log(error);
    }
}

export const generateTestToken = (uid) => {
    const expiresIn = 1; // 1 second

    try {
        const accessToken = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn });
        return { accessToken, expiresIn };
    } catch (error) {
        console.log(error);
    }
}

export const generateRefreshToken = (uid, res) => {
    const expiresIn = 60 * 60 * 24 * 30; // 30 days

    try {
        const refreshToken = jwt.sign({ uid }, process.env.JWT_REFRESH, { expiresIn });
        return refreshToken;
        // res.cookie("refreshToken", refreshToken, {
        //     httpOnly: true,
        //     secure: !(process.env.MODE === "development" || process.env.MODE === "test"),
        //     expires: new Date(Date.now() + expiresIn * 1000),
        // });
    } catch (error) {
        console.log(error);
    }
}