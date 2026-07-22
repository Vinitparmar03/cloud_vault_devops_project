import { Router } from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

const createServiceProxy = (target, prefix) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    cookieDomainRewrite: "",
    pathRewrite: (path) => {
      const rewritten = `${prefix}${path}`;
      console.log("Rewrite:", path, "->", rewritten);
      return rewritten;
    },
    on: {
      proxyReq: fixRequestBody,

      proxyRes: (proxyRes) => {
        console.log("Proxy Response:", proxyRes.statusCode);
      },

      error: (err, req, res) => {
        console.error("Proxy Error:", err);

        if (!res.headersSent) {
          res.status(500).json({
            message: err.message,
          });
        }
      },
    },
  });
};

// Auth Service
router.use(
  "/v1/auth",
  createServiceProxy(
    process.env.USER_SERVICE,
    "/api/v1/auth"
  )
);

// User Service
router.use(
  "/v1/user",
  createServiceProxy(
    process.env.USER_SERVICE,
    "/api/v1/user"
  )
);

// Vault Service
router.use(
  "/v1/vault",
  verifyJWT,
  createServiceProxy(
    process.env.VAULT_SERVICE,
    "/api/v1/vault"
  )
);

export default router;