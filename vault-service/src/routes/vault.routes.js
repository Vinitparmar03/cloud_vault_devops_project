import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createVault, deleteVault, getAllVaults, getVaultById } from "../controllers/vault.controllers.js";
import upload from "../middleware/multer.middleware.js";


const router = express.Router();

router.use(verifyJWT)


router.post(
    "/",
    upload.single("file"),
    createVault
);
router.get("/", getAllVaults)
router.get("/:id", getVaultById)
router.delete("/:id", deleteVault)


export default router