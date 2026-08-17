import client from 'prom-client';

client.collectDefaultMetrics();

export const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});

export const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5],
});

export const userGoogleLoginSuccessCounter = new client.Counter({
    name: 'user_google_login_success_total',
    help: 'Total number of successful Google logins',
    labelNames: ['method', 'route', 'status_code'],
});

export const userGoogleLoginFailureCounter = new client.Counter({
    name: 'user_google_login_failure_total',
    help: 'Total number of failed Google logins',
    labelNames: ['method', 'route', 'status_code'],
});
export const register = client.register;

