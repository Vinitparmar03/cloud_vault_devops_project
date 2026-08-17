import client from "prom-client";

client.collectDefaultMetrics();

export const httpRequestCounter = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
});

export const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 0.5, 1, 2, 5],
});

export const gatewayProxyRequests = new client.Counter({
    name: "gateway_proxy_requests_total",
    help: "Total proxy requests forwarded to backend services",
    labelNames: ["service", "status_code"],
});

export const gatewayProxyErrors = new client.Counter({
    name: "gateway_proxy_errors_total",
    help: "Total proxy errors",
    labelNames: ["service"],
});

export const register = client.register;