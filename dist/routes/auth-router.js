"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const input_validation_1 = require("../middlewares/input-validation");
const jwt_service_1 = require("../application/jwt-service");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
const auth_service_1 = require("../domain/auth-service");
const users_repository_db_1 = require("../repositories/users/users-repository-db");
exports.authRouter = (0, express_1.Router)({});
//emails
exports.authRouter.post('/registration', input_validation_1.loginValidation, input_validation_1.emailValidation, input_validation_1.passwordValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdAccount = yield auth_service_1.authService.createUser(req.body);
    if (!createdAccount) {
        res.send({ "errorsMessages": 'can not send email. try later' });
        return;
    }
    res.send(204);
}));
exports.authRouter.post('/registration-email-resending', input_validation_1.emailValidationForResending, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isEmailResend = yield auth_service_1.authService.resendEmail(req.body.email);
    if (!isEmailResend) {
        res.send({ "errorsMessages": 'can not send email. try later' });
        return;
    }
    res.send(204);
}));
exports.authRouter.post('/registration-confirmation', input_validation_1.confirmationCodeValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isConfirmed = yield auth_service_1.authService.confirmEmail(req.body.code);
    if (!isConfirmed) {
        return res.send(400);
    }
    res.send(204);
}));
exports.authRouter.post('/login', input_validation_1.loginOrEmailValidation, input_validation_1.passwordAuthValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_service_1.authService.checkCredentials(req.body);
    if (!user) {
        res.clearCookie('refreshToken');
        res.send(401);
        return;
    }
    const ip = req.ip;
    const deviceName = req.headers['user-agent'];
    const accessToken = yield jwt_service_1.jwtService.createJWTAccessToken(user);
    const refreshToken = yield jwt_service_1.jwtService.createJWTRefreshToken(user, deviceName, ip);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false
    });
    res.json({ 'accessToken': accessToken });
}));
exports.authRouter.post('/refresh-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!req.cookies.refreshToken) {
        console.log('!cookie');
        res.send(401);
        return;
    }
    const userId = yield jwt_service_1.jwtService.getUserIdByRefreshToken(refreshToken);
    if (!userId) {
        res.clearCookie('refreshToken');
        console.log('no user id');
        res.send(401);
        return;
    }
    const user = yield users_repository_db_1.usersRepository.findUserById(userId);
    const newAccessToken = yield jwt_service_1.jwtService.createJWTAccessToken(user);
    const isRefreshTokenActive = yield jwt_service_1.jwtService.checkRefreshToken(refreshToken);
    if (!isRefreshTokenActive) {
        res.send(401);
        return;
    }
    const newRefreshToken = yield jwt_service_1.jwtService.updateJWTRefreshToken(refreshToken);
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false
    });
    res.json({ 'accessToken': newAccessToken });
}));
exports.authRouter.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!req.cookies.refreshToken) {
        res.send(401);
        return;
    }
    const userId = yield jwt_service_1.jwtService.getUserIdByRefreshToken(refreshToken);
    if (!userId) {
        res.clearCookie('refreshToken');
        res.send(401);
        return;
    }
    const isRefreshTokenActive = yield jwt_service_1.jwtService.checkRefreshToken(refreshToken);
    if (!isRefreshTokenActive) {
        res.send(401);
        return;
    }
    yield jwt_service_1.jwtService.deleteSession(refreshToken);
    res.clearCookie('refreshToken');
    return res.send(204);
}));
exports.authRouter.get('/me', auth_middlewares_1.bearerAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.send({
        "email": user.accountData.email,
        "login": user.accountData.login,
        "userId": user._id.toString()
    });
}));
