import rateLimit from 'express-rate-limit'

export const registrationRequestsLimiter = rateLimit({
    windowMs: 10 * 1000, // 15 minutes
    max: 5,
    message: 'too many requests from this IP',// Limit each IP to 100 requests per `window` (here, per 15 minutes)
})

export const registrationResendingLimiter = rateLimit({
    windowMs: 10 * 1000, // 15 minutes
    max: 5,
    message: 'too many requests from this IP',// Limit each IP to 100 requests per `window` (here, per 15 minutes)
})

export const registrationConfirmationLimiter = rateLimit({
    windowMs: 10 * 1000, // 15 minutes
    max: 5,
    message: 'too many requests from this IP',// Limit each IP to 100 requests per `window` (here, per 15 minutes)
})

export const loginRequestsLimiter = rateLimit({
    windowMs: 10 * 1000, // 15 minutes
    max: 5,
    message: 'too many requests from this IP',// Limit each IP to 100 requests per `window` (here, per 15 minutes)
})


