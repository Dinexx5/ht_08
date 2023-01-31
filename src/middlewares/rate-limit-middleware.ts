import rateLimit from 'express-rate-limit'

const limiterOptions = {
    windowMs: 10 * 1000,
        max: 5,
    message: 'too many requests from this IP',
}

export const registrationRequestsLimiter = rateLimit(limiterOptions)

export const registrationResendingLimiter = rateLimit(limiterOptions)

export const registrationConfirmationLimiter = rateLimit(limiterOptions)

export const loginRequestsLimiter = rateLimit(limiterOptions)


