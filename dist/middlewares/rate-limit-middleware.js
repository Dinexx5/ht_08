"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRequestsLimiter = exports.registrationConfirmationLimiter = exports.registrationResendingLimiter = exports.registrationRequestsLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.registrationRequestsLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 1000,
    max: 5,
    message: 'too many requests from this IP', // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});
exports.registrationResendingLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 1000,
    max: 5,
    message: 'too many requests from this IP', // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});
exports.registrationConfirmationLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 1000,
    max: 5,
    message: 'too many requests from this IP', // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});
exports.loginRequestsLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 1000,
    max: 5,
    message: 'too many requests from this IP', // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});
