import {Request, Response, Router} from "express"
import {jwtService} from "../application/jwt-service";
import {devicesRepository} from "../repositories/devices/devices-repository";


export const devicesRouter = Router({})

devicesRouter.get('/', async (req: Request, res: Response) =>{
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        res.send(401)
        return
    }
    const userId = await jwtService.getUserIdByRefreshToken(refreshToken)
    if (!userId) {
        res.send(401)
        return
    }
    const foundDevices = await devicesRepository.getActiveSessions(userId)
    return res.send(foundDevices)
})

devicesRouter.delete('/',async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        res.send(401)
        return
    }
    const result: any = await jwtService.getTokenInfo(refreshToken)
    const {deviceId, userId} = result
    const isDeleted: boolean = await devicesRepository.deleteAllSessions(deviceId, userId)
    if (!isDeleted) {
        console.log('Something wrong with delete operation')
    }
    return res.send(204)
})

devicesRouter.delete('/:deviceId',async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        res.send(401)
        return
    }
    const result: any = await jwtService.getTokenInfo(refreshToken)
    const {userId} = result
    const foundDevice = await devicesRepository.findDeviceByDeviceId(req.params.deviceId)
    if (!foundDevice) {
        return res.send(404)
    }
    if (foundDevice.userId.toString() !== userId) {
        return res.send(403)
    }
    const isDeleted: boolean = await devicesRepository.deleteSessionById(req.params.deviceId)
    if (!isDeleted) {
        console.log('Something wrong with delete operation')
    }
    return res.send(204)
})