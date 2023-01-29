import rateLimit from 'express-rate-limit'

export const requestsLimiter = rateLimit({
    windowMs: 10 * 1000, // 15 minutes
    max: 5,
    message: 'too many requests from this IP',// Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,// Disable the `X-RateLimit-*` headers
    handler: (request, response, next, options) =>
        response.status(options.statusCode).send(options.message),
})