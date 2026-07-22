
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import proxyRoutes from "./routes/proxy.routes.js";

const app = express();
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(cookieParser());

app.use("/api", (req, res, next) => {
  console.log("Gateway received:", req.method, req.originalUrl);
  next();
});

app.use("/api", proxyRoutes);


export default app;