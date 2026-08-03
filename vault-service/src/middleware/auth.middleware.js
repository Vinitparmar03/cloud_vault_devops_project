import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";


export const verifyJWT = (req, res, next) => {
    const token = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "")
        console.log(token);
        if(!token) {
            throw new ApiError(401, "Not authorized")
        }
        
        const decode = verifyAccessToken(token);
        
        console.log(decode);
        req.user = {
            _id: decode._id
        }


    next();
}