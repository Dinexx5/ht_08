import {refreshTokenModel, userAccountDbModel} from "../models/models";
import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {settings} from "../settings";
import {jwtRepository} from "../repositories/jwt-repository";
import {devicesRepository} from "../repositories/devices/devices-repository";



export const jwtService = {

    async createJWTAccessToken(user: userAccountDbModel): Promise<string> {
        return jwt.sign({userId: user._id}, settings.JWT_ACCESS_SECRET, {expiresIn: "10s"})

    },

    async createJWTRefreshToken(user: userAccountDbModel, deviceName: string, ip: string): Promise<string> {

        const deviceId = new Date().toISOString()
        const refreshToken = jwt.sign({userId: user._id, deviceId: deviceId}, settings.JWT_REFRESH_SECRET, {expiresIn: "20s"})
        const result = await this.getTokenInfo(refreshToken)
        const issuedAt = new Date(result.iat*1000).toISOString()
        console.log(result)

        const dbToken: refreshTokenModel = {
            issuedAt: issuedAt,
            userId: user._id,
            deviceId: deviceId,
            deviceName: deviceName,
            ip: ip,
            expiredAt: new Date(result.exp*1000).toISOString()

        }
        await jwtRepository.saveRefreshTokenForUser(dbToken)
        const newDevice = {
            _id: new ObjectId(),
            userId: user._id,
            ip: ip,
            title: deviceName,
            lastActiveDate: issuedAt,
            deviceId: deviceId
        }
        await devicesRepository.saveNewDevice(newDevice)

        return refreshToken

    },
    async updateJWTRefreshToken(refreshToken: string): Promise<string> {
        const result: any = jwt.verify(refreshToken,settings.JWT_REFRESH_SECRET)
        const {deviceId, userId, exp} = result
        const newRefreshToken = jwt.sign({userId: userId, deviceId: deviceId}, settings.JWT_REFRESH_SECRET, {expiresIn: "20s"})
        const newResult: any = await this.getTokenInfo(newRefreshToken)
        console.log(newResult)
        const newExpirationDate = new Date(newResult.exp*1000).toISOString()
        const newIssuedAt = new Date(newResult.iat*1000).toISOString()
        const expirationDate = new Date(exp*1000).toISOString()
        const isUpdated = await jwtRepository.updateRefreshTokenForUser(expirationDate, newExpirationDate, newIssuedAt)
        if (!isUpdated){
            console.log('Can not update')
        }
        await devicesRepository.updateDeviceLastActiveDate(deviceId, newIssuedAt)
        return newRefreshToken

    },

    async deleteSession(token: string): Promise<boolean> {
        const result: any = await this.getTokenInfo(token)
        const expirationDate = new Date(result.exp*1000).toISOString()
        return jwtRepository.deleteSession(expirationDate)

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
    },
    async getTokenInfo (token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_REFRESH_SECRET)
            return result
        } catch (error) {
            return null
        }
    },
    async checkRefreshToken(refreshToken: string): Promise<boolean> {
        const result: any = await jwt.verify(refreshToken,settings.JWT_REFRESH_SECRET)
        const expirationDate = new Date(result.exp*1000).toISOString()
        const currentDate = new Date().toISOString()
        const foundToken = await jwtRepository.findRefreshTokenByExpirationDate(expirationDate)
        if(!foundToken) {
            return false
        }
        if (expirationDate < currentDate) {
            return false
        }
        return true
    }

}