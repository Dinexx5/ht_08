import rateLimit from 'express-rate-limit'

export const requestsLimiter = rateLimit({
    windowMs: 10 * 1000, // 15 minutes
    max: 4,
    message: 'too many requests from this IP',// Limit each IP to 100 requests per `window` (here, per 15 minutes)
})


