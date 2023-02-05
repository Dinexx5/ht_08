import {emailAdapter} from "../adapters/email-adapter";

export const emailService = {
    async sendEmailForConfirmation(email: string, code: string) {
       return await emailAdapter.sendEmailForConfirmation(email, code)

    },
    async sendEmailForPasswordRecovery(email: string, code: string) {
        return await emailAdapter.sendEmailForPasswordRecovery(email, code)

    }

}
