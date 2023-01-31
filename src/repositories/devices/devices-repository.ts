import {devicesCollection} from "../db";
import {ObjectId} from "mongodb";
import {deviceDbModel, deviceViewModel} from "../../models/models";


export const devicesRepository = {
    async saveNewDevice(newDevice: deviceDbModel) {
        await devicesCollection.insertOne(newDevice)
    },

    async updateDeviceLastActiveDate(deviceId: string, newIssuedAt: string) {
        await devicesCollection.updateOne({deviceId: deviceId}, {$set: {lastActiveDate: newIssuedAt}})
    },

    async getActiveSessions(userId: object):Promise<deviceViewModel[]> {
       const foundDevices = await devicesCollection.find({userId: userId}).toArray()
        return foundDevices.map(device => ({
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.lastActiveDate,
            deviceId: device.deviceId
        }))
    },

    async deleteAllSessions(deviceId: string, userId: string): Promise<boolean> {
        const _id = new ObjectId(userId)
        const result = await devicesCollection.deleteMany( {$and: [{ userId: _id}, {deviceId: { $ne: deviceId }} ]})
        if (result.deletedCount) {
            return true
        }
        return false
    },

    async findDeviceByDeviceId(deviceId: string): Promise<deviceDbModel | null> {
        const foundDevice = await devicesCollection.findOne({deviceId: deviceId})
        if (!foundDevice) {
            return null
        }
        return foundDevice
    },

    async deleteSessionById(deviceId: string): Promise<boolean> {
        const result = await devicesCollection.deleteOne({ deviceId: deviceId })
        return result.deletedCount === 1
    },

}