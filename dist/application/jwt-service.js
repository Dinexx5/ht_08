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
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
const settings_1 = require("../settings");
const jwt_repository_1 = require("../repositories/jwt-repository");
const devices_repository_1 = require("../repositories/devices/devices-repository");
exports.jwtService = {
    createJWTAccessToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ userId: user._id }, settings_1.settings.JWT_ACCESS_SECRET, { expiresIn: "1000s" });
        });
    },
    createJWTRefreshToken(user, deviceName, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = new Date().toISOString();
            const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id, deviceId: deviceId }, settings_1.settings.JWT_REFRESH_SECRET, { expiresIn: "2000s" });
            const result = yield this.getTokenInfo(refreshToken);
            const issuedAt = new Date(result.iat * 1000).toISOString();
            console.log(result);
            const dbToken = {
                issuedAt: issuedAt,
                userId: user._id,
                deviceId: deviceId,
                deviceName: deviceName,
                ip: ip,
                expiredAt: new Date(result.exp * 1000).toISOString()
            };
            yield jwt_repository_1.jwtRepository.saveRefreshTokenForUser(dbToken);
            const newDevice = {
                _id: new mongodb_1.ObjectId(),
                userId: user._id,
                ip: ip,
                title: deviceName,
                lastActiveDate: issuedAt,
                deviceId: deviceId
            };
            yield devices_repository_1.devicesRepository.saveNewDevice(newDevice);
            return refreshToken;
        });
    },
    updateJWTRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = jsonwebtoken_1.default.verify(refreshToken, settings_1.settings.JWT_REFRESH_SECRET);
            const { deviceId, userId, exp } = result;
            const newRefreshToken = jsonwebtoken_1.default.sign({ userId: userId, deviceId: deviceId }, settings_1.settings.JWT_REFRESH_SECRET, { expiresIn: "2000s" });
            const newResult = yield this.getTokenInfo(newRefreshToken);
            console.log(newResult);
            const newExpirationDate = new Date(newResult.exp * 1000).toISOString();
            const newIssuedAt = new Date(newResult.iat * 1000).toISOString();
            const expirationDate = new Date(exp * 1000).toISOString();
            const isUpdated = yield jwt_repository_1.jwtRepository.updateRefreshTokenForUser(expirationDate, newExpirationDate, newIssuedAt);
            if (!isUpdated) {
                console.log('Can not update');
            }
            yield devices_repository_1.devicesRepository.updateDeviceLastActiveDate(deviceId, newIssuedAt);
            return newRefreshToken;
        });
    },
    deleteSession(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getTokenInfo(token);
            const expirationDate = new Date(result.exp * 1000).toISOString();
            return jwt_repository_1.jwtRepository.deleteSession(expirationDate);
        });
    },
    getUserIdByAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, settings_1.settings.JWT_ACCESS_SECRET);
                return new mongodb_1.ObjectId(result.userId);
            }
            catch (error) {
                return null;
            }
        });
    },
    getUserIdByRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, settings_1.settings.JWT_REFRESH_SECRET);
                return new mongodb_1.ObjectId(result.userId);
            }
            catch (error) {
                return null;
            }
        });
    },
    getTokenInfo(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, settings_1.settings.JWT_REFRESH_SECRET);
                return result;
            }
            catch (error) {
                return null;
            }
        });
    },
    checkRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield jsonwebtoken_1.default.verify(refreshToken, settings_1.settings.JWT_REFRESH_SECRET);
            const expirationDate = new Date(result.exp * 1000).toISOString();
            const currentDate = new Date().toISOString();
            const foundToken = yield jwt_repository_1.jwtRepository.findRefreshTokenByExpirationDate(expirationDate);
            if (!foundToken) {
                return false;
            }
            if (expirationDate < currentDate) {
                return false;
            }
            return true;
        });
    }
};
