import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";


export const verifyJWT = (req, res, next) => {
    const token = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "")
        console.log("Token from request:", token);
        
        if(!token) {
            throw new ApiError(401, "Not authorized")
        }
        
        const decode = verifyAccessToken(token);
        
        req.user = {
            _id: decode._id
        }

        console.log(req.user)

    next();
}