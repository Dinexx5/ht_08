"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestsLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.requestsLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 1000,
    max: 5,
    message: 'too many request from this IP',
    standardHeaders: false,
    legacyHeaders: false,
    handler: (request, response, next, options) => response.status(options.statusCode).send(options.message),
});
