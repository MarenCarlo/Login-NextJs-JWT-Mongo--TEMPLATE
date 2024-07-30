import { consumeService } from "./utils/service"


export const createSession = async (userData) => {
    return await consumeService({
        url: `auth`,
        method: 'POST',
        body: JSON.stringify(userData)
    })
}
