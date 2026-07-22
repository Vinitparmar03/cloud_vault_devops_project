import { Router } from "express";

import {
    googleLogin,
    refreshAccessToken,
    logout,
} from "../controllers/auth.controllers.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/google", googleLogin);

router.post("/refresh", refreshAccessToken);

router.post("/logout", verifyJWT, logout);

export default router;