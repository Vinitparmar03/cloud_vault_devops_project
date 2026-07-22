import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/secrets.js";
export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
};