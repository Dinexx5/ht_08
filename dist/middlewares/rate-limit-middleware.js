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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = exports.newPasswordRequestsLimiter = exports.passwordRecoveryRequestsLimiter = exports.loginRequestsLimiter = exports.registrationConfirmationLimiter = exports.registrationResendingLimiter = exports.registrationRequestsLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const date_fns_1 = require("date-fns");
const attempts_repository_1 = require("../repositories/attempts-repository");
const limiterOptions = {
    windowMs: 10 * 1000,
    max: 5,
    message: 'too many requests from this IP',
};
exports.registrationRequestsLimiter = (0, express_rate_limit_1.default)(limiterOptions);
exports.registrationResendingLimiter = (0, express_rate_limit_1.default)(limiterOptions);
exports.registrationConfirmationLimiter = (0, express_rate_limit_1.default)(limiterOptions);
exports.loginRequestsLimiter = (0, express_rate_limit_1.default)(limiterOptions);
exports.passwordRecoveryRequestsLimiter = (0, express_rate_limit_1.default)(limiterOptions);
exports.newPasswordRequestsLimiter = (0, express_rate_limit_1.default)(limiterOptions);
const limiter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { ip, url } = req;
    const requestData = ip + url;
    const dateNow = new Date().toISOString();
    yield attempts_repository_1.attemptsRepository.addNewAttempt(requestData, dateNow);
    const tenSecondsAgo = (0, date_fns_1.subSeconds)(new Date(dateNow), 10).toISOString();
    const requestsCount = yield attempts_repository_1.attemptsRepository.countAttempts(requestData, tenSecondsAgo);
    if (requestsCount > 5) {
        return res.status(429).send('too many requests');
    }
    return next();
});
exports.limiter = limiter;
