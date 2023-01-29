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
exports.devicesRouter = void 0;
const express_1 = require("express");
const jwt_service_1 = require("../application/jwt-service");
const devices_repository_1 = require("../repositories/devices/devices-repository");
exports.devicesRouter = (0, express_1.Router)({});
exports.devicesRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.send(401);
        return;
    }
    const userId = yield jwt_service_1.jwtService.getUserIdByRefreshToken(refreshToken);
    if (!userId) {
        res.send(401);
        return;
    }
    const foundDevices = yield devices_repository_1.devicesRepository.getActiveSessions(userId);
    return res.send(foundDevices);
}));
exports.devicesRouter.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.send(401);
        return;
    }
    const result = yield jwt_service_1.jwtService.getTokenInfo(refreshToken);
    const { deviceId, userId } = result;
    const isDeleted = yield devices_repository_1.devicesRepository.deleteAllSessions(deviceId, userId);
    if (!isDeleted) {
        console.log('Something wrong with delete operation');
    }
    return res.send(204);
}));
exports.devicesRouter.delete('/:deviceId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.send(401);
        return;
    }
    const result = yield jwt_service_1.jwtService.getTokenInfo(refreshToken);
    const { userId } = result;
    const foundDevice = yield devices_repository_1.devicesRepository.findDeviceByDeviceId(req.params.deviceId);
    if (!foundDevice) {
        return res.send(404);
    }
    if (foundDevice.userId.toString() !== userId) {
        return res.send(403);
    }
    const isDeleted = yield devices_repository_1.devicesRepository.deleteSessionById(req.params.deviceId);
    if (!isDeleted) {
        console.log('Something wrong with delete operation');
    }
    return res.send(204);
}));
