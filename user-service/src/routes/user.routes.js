import { Router } from "express";

import {
    getCurrentUser,
} from "../controllers/user.controllers.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", verifyJWT, getCurrentUser);

export default router;