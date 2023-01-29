import {tokenCollection} from "./db";
import {refreshTokenModel} from "../models/models";


export const jwtRepository = {

    async saveRefreshTokenForUser(newDbToken: refreshTokenModel) {
        await tokenCollection.insertOne(newDbToken)

    },

    async updateRefreshTokenForUser(expirationDate: string, newExpirationDate: string, newIssuedAt: string): Promise<boolean> {
        const result = await tokenCollection.updateOne( {expiredAt: expirationDate}, {$set: {expiredAt: newExpirationDate, issuedAt: newIssuedAt} } )
        return result.modifiedCount === 1
    },

    async findToken(refreshToken: string): Promise<boolean> {
        const isFound = await tokenCollection.findOne({token: refreshToken})
        if (!isFound){
            return false
        }
        return true
    },

    async deleteSession(expirationDate: string): Promise<boolean> {
        const result = await tokenCollection.deleteOne({expiredAt: expirationDate})
        return result.deletedCount === 1
    },
    async findRefreshTokenByExpirationDate(expirationDate: string): Promise<refreshTokenModel | null> {
        const foundToken = await tokenCollection.findOne({expiredAt: expirationDate})
        return foundToken
    }
}