import dotenv from "dotenv";
dotenv.config();

const { default: app } = await import("./app.js");
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5002;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Vault Service running on ${PORT}`);
        });
    });