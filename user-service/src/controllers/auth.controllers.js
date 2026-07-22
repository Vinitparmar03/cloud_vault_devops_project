import client from "../config/google.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/jwt.js";

const accessCookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 2 * 60 * 1000,
};

const refreshCookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const googleLogin = asyncHandler(async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        throw new ApiError(400, "Google ID Token is required");
    }

    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
        throw new ApiError(401, "Invalid Google Token");
    }

    const { name, email, picture, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            googleId: sub,
            name,
            email,
            picture,
        });
    }

    // Pass ONLY the user ID
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;

    await user.save({
        validateBeforeSave: false,
    });

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessCookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        picture: user.picture,
                    },
                },
                "Login Successful"
            )
        );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh Token Missing");
    }

    const decoded = verifyRefreshToken(incomingRefreshToken);

    // jwt.js uses _id
    const user = await User.findById(decoded._id);

    if (!user) {
        throw new ApiError(401, "Invalid Refresh Token");
    }

    if (user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Refresh Token Expired");
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;

    await user.save({
        validateBeforeSave: false,
    });

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessCookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(
            new ApiResponse(
                200,
                {},
                "Access Token Refreshed"
            )
        );
});

export const logout = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        }
    );

    return res
        .status(200)
        .clearCookie("accessToken", accessCookieOptions)
        .clearCookie("refreshToken", refreshCookieOptions)
        .json(
            new ApiResponse(
                200,
                {},
                "Logout Successful"
            )
        );
});