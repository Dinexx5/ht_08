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
exports.jwtRepository = void 0;
const db_1 = require("./db");
exports.jwtRepository = {
    saveRefreshTokenForUser(newDbToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.tokenCollection.insertOne(newDbToken);
            return newDbToken.token;
        });
    },
    updateRefreshTokenForUser(newDbToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.tokenCollection.updateOne({ userId: newDbToken.userId }, { $set: { token: newDbToken.token } });
            return newDbToken.token;
        });
    },
    findToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isFound = yield db_1.tokenCollection.findOne({ refreshToken: refreshToken });
            if (!isFound) {
                return false;
            }
            return true;
        });
    },
    deleteToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.tokenCollection.deleteOne({ refreshToken: refreshToken });
            return result.deletedCount === 1;
        });
    }
};