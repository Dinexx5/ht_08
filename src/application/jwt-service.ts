import {refreshTokenModel, userAccountDbModel} from "../models/models";
import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {settings} from "../settings";
import {jwtRepository} from "../repositories/jwt-repository";



export const jwtService = {

    async createJWTAccessToken(user: userAccountDbModel): Promise<string> {
        return jwt.sign({userId: user._id}, settings.JWT_ACCESS_SECRET, {expiresIn: "10s"})

    },

    async createJWTRefreshToken(user: userAccountDbModel): Promise<string> {
        const refreshToken = jwt.sign({userId: user._id}, settings.JWT_REFRESH_SECRET, {expiresIn: "20s"})
        const dbToken: refreshTokenModel = {
            userId: user._id,
            token: refreshToken
        }
        return await jwtRepository.saveRefreshTokenForUser(dbToken)

    },
    async createNewJWTRefreshToken(user: userAccountDbModel): Promise<string> {
        const newRefreshToken = jwt.sign({userId: user._id}, settings.JWT_REFRESH_SECRET, {expiresIn: "20s"})
        const newDbToken: refreshTokenModel = {
            userId: user._id,
            token: newRefreshToken
        }
        return await jwtRepository.updateRefreshTokenForUser(newDbToken)

    },

    async deletePreviousRefreshToken(token: string): Promise<boolean> {
        return jwtRepository.deleteToken(token)

    },

    async getUserIdByAccessToken (token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_ACCESS_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    },

    async getUserIdByRefreshToken (token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_REFRESH_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    }

}