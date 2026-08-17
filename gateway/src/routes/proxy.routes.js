import { Router } from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { gatewayProxyErrors, gatewayProxyRequests } from "../metrics/metrics.js";

const router = Router();

const createServiceProxy = (target, prefix, serviceName) => {
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
        gatewayProxyRequests.inc({
          service: serviceName,
          status_code: proxyRes.statusCode,
        })
        console.log("Proxy Response:", proxyRes.statusCode);
      },

      error: (err, req, res) => {
        console.error("Proxy Error:", err);
        gatewayProxyErrors.inc({
          service: serviceName
        });
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
    "/api/v1/auth",
    "user-service"
  )
);

// User Service
router.use(
  "/v1/user",
  createServiceProxy(
    process.env.USER_SERVICE,
    "/api/v1/user",
    "user-service"
  )
);

// Vault Service
router.use(
  "/v1/vault",
  verifyJWT,
  createServiceProxy(
    process.env.VAULT_SERVICE,
    "/api/v1/vault",
    "vault-service"
  )
);

export default router;