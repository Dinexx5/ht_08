"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRequestsLimiter = exports.registrationConfirmationLimiter = exports.registrationResendingLimiter = exports.registrationRequestsLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const limiterOptions = {
    windowMs: 10 * 1000,
    max: 5,
    message: 'too many requests from this IP',
};
exports.registrationRequestsLimiter = (0, express_rate_limit_1.default)(limiterOptions);
exports.registrationResendingLimiter = (0, express_rate_limit_1.default)(limiterOptions);
exports.registrationConfirmationLimiter = (0, express_rate_limit_1.default)(limiterOptions);
exports.loginRequestsLimiter = (0, express_rate_limit_1.default)(limiterOptions);
