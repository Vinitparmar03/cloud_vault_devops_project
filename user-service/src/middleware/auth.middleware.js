import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(401, "Not authorized")
        }
        
        const decode = verifyAccessToken(token);

    const user = await User.findById(decode._id).select("-refreshToken");
    if (!user) {
        throw new ApiError(401, "Invalid Token");
    }

    req.user = user;

    next();
})