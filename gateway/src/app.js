import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import proxyRoutes from "./routes/proxy.routes.js";
import { httpRequestCounter, httpRequestDuration, register } from "./metrics/metrics.js";

const app = express();
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(cookieParser());

app.use((req, res, next) => {
  if (req.path === "/metrics") {
    return next();
  }

  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    const labels = {
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    };

    httpRequestCounter.inc(labels);

    end(labels);
  });
  next();
})

app.get("/metrics", async (req, res) => {
  res.set('Content-Type', register.contentType);
	res.end(await register.metrics());
});

app.use("/api", proxyRoutes);

export default app;