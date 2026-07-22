import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/secrets.js";

export const verifyJWT = (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    try {
        jwt.verify(token, ACCESS_TOKEN_SECRET);
        next();

    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid Token",
        });
    }
};