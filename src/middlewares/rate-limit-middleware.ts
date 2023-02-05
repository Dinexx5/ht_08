import rateLimit from 'express-rate-limit'
import {NextFunction, Request, Response} from "express";
import {subSeconds} from "date-fns";
import {attemptsRepository} from "../repositories/attempts-repository";

const limiterOptions = {
    windowMs: 10 * 1000,
        max: 5,
    message: 'too many requests from this IP',
}

export const registrationRequestsLimiter = rateLimit(limiterOptions)

export const registrationResendingLimiter = rateLimit(limiterOptions)

export const registrationConfirmationLimiter = rateLimit(limiterOptions)

export const loginRequestsLimiter = rateLimit(limiterOptions)

export const passwordRecoveryRequestsLimiter = rateLimit(limiterOptions)

export const newPasswordRequestsLimiter = rateLimit(limiterOptions)


export const limiter = async (req: Request, res: Response, next: NextFunction) => {
    const {ip, url} = req
    const requestData = ip + url
    const dateNow = new Date().toISOString()
    await attemptsRepository.addNewAttempt(requestData, dateNow)
    const tenSecondsAgo = subSeconds(new Date(dateNow), 10).toISOString()
    const requestsCount = await attemptsRepository.countAttempts(requestData,tenSecondsAgo)
    if (requestsCount > 5) {
        return res.status(429).send('too many requests')
    }
    return next()
}


