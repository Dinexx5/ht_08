import {Request, Response, Router} from "express"
import {RequestWithBody} from "../models/types";
import {
    authInputModel,
    createUserInputModel,
    registrationConfirmationInput,
    resendEmailModel,
} from "../models/models";
import {
    confirmationCodeValidation,
    emailValidation, emailValidationForResending,
    inputValidationMiddleware,
    loginOrEmailValidation, loginValidation,
    passwordAuthValidation, passwordValidation,
} from "../middlewares/input-validation";
import {jwtService} from "../application/jwt-service";
import {bearerAuthMiddleware} from "../middlewares/auth-middlewares";
import {authService} from "../domain/auth-service";
import {jwtRepository} from "../repositories/jwt-repository";
import {usersRepository} from "../repositories/users/users-repository-db";



export const authRouter = Router({})


//emails

authRouter.post('/registration',
    loginValidation,
    emailValidation,
    passwordValidation,
    inputValidationMiddleware,
    async(req: RequestWithBody<createUserInputModel>, res: Response) => {

    const createdAccount = await authService.createUser(req.body)
    if (!createdAccount) {
        res.send({"errorsMessages": 'can not send email. try later'})
        return
    }
    res.send(204)

})

authRouter.post('/registration-email-resending',
    emailValidationForResending,
    inputValidationMiddleware,
    async(req: RequestWithBody<resendEmailModel>, res: Response) => {

    const isEmailResend = await authService.resendEmail(req.body.email)

    if (!isEmailResend) {
        res.send({"errorsMessages": 'can not send email. try later'})
        return
    }
    res.send(204)

})

authRouter.post('/registration-confirmation',
    confirmationCodeValidation,
    inputValidationMiddleware,
    async(req: RequestWithBody<registrationConfirmationInput>, res: Response) => {

    const isConfirmed = await authService.confirmEmail(req.body.code)
    if (!isConfirmed) {
        return res.send(400)
    }
    res.send(204)

})


authRouter.post('/login',
    loginOrEmailValidation,
    passwordAuthValidation,
    inputValidationMiddleware,
    async(req: RequestWithBody<authInputModel>, res: Response) => {
        const user = await authService.checkCredentials(req.body)
        if (!user) {
            res.clearCookie('refreshToken')
            res.send(401)
            return
        }
        const accessToken = await jwtService.createJWTAccessToken(user)
        const refreshToken = await jwtService.createJWTRefreshToken(user)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true
        })
        res.json({'accessToken': accessToken})

})

authRouter.post('/refresh-token',
    async(req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!req.cookies.refreshToken) {
        console.log('!cookie')
        res.send(401)
        return
    }
    const userId = await jwtService.getUserIdByRefreshToken(refreshToken)
    const isTokenActive = await jwtRepository.findToken(refreshToken)
    if (!userId) {
        res.clearCookie('refreshToken')
        console.log('no user id')
        res.send(401)
        return
    }
    if (!isTokenActive) {
        res.clearCookie('refreshToken')
        console.log('not active token')
        res.send(401)
        return
    }
    const user = await usersRepository.findUserById(userId)
    const newAccessToken = await jwtService.createJWTAccessToken(user)
    const newRefreshToken = await jwtService.createNewJWTRefreshToken(user)
    await jwtService.deletePreviousRefreshToken(refreshToken)
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true
    })
    res.json({'accessToken': newAccessToken})

    })

authRouter.post('/logout',
    async(req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        if (!req.cookies.refreshToken) {
            res.send(401)
            return
        }
        const userId = await jwtService.getUserIdByRefreshToken(refreshToken)
        const isTokenActive = await jwtRepository.findToken(refreshToken)
        if (!userId) {
            res.clearCookie('refreshToken')
            res.send(401)
            return
        }
        if (!isTokenActive) {
            res.clearCookie('refreshToken')
            res.send(401)
            return
        }
        await jwtService.deletePreviousRefreshToken(refreshToken)
        res.clearCookie('refreshToken')
        return res.send(204)

    })

authRouter.get('/me',
    bearerAuthMiddleware,
    async(req: Request, res: Response) => {
        const user = req.user!;
        res.send({
            "email": user.accountData.email,
            "login": user.accountData.login,
            "userId": user._id.toString()
        })
    })