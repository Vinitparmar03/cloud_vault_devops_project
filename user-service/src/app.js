import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import { httpRequestCounter, httpRequestDuration, register } from "./metrics/metrics.js";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    if(req.path === "/metrics") {
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

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/user", userRoutes);

app.get("/metrics", async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});



app.use((err, req, res, next) => {

    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });

});

export default app;
