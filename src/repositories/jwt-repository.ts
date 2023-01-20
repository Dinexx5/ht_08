import {tokenCollection} from "./db";
import {refreshTokenModel} from "../models/models";


export const jwtRepository = {

    async saveRefreshTokenForUser(newDbToken: refreshTokenModel): Promise<string> {
        await tokenCollection.insertOne(newDbToken)
        return newDbToken.token
    },

    async updateRefreshTokenForUser(newDbToken: refreshTokenModel): Promise<string> {
        await tokenCollection.updateOne( {userId: newDbToken.userId}, {$set: {token: newDbToken.token} } )
        return newDbToken.token
    },

    async findToken(refreshToken: string): Promise<boolean> {
        const isFound = await tokenCollection.findOne({token: refreshToken})
        if (!isFound){
            return false
        }
        return true
    },

    async deleteToken(refreshToken: string): Promise<boolean> {
        const result = await tokenCollection.deleteOne({token: refreshToken})
        return result.deletedCount === 1
    }
}