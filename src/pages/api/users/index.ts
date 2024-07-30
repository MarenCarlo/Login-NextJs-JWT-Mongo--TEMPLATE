import type { NextApiRequest, NextApiResponse } from 'next'
import userCreate from './endpoints/userCreate';
import validateToken from '@/middlewares/validateToken';

interface SessionResult {
    status: number;
    error: boolean;
    message?: string,
    data?: any
}

export default async function handleRequest(req: NextApiRequest, res: NextApiResponse<SessionResult>) {
    const { method, body } = req;
    let bodyParsed: any;
    if (typeof body === 'string') {
        bodyParsed = JSON.parse(body);
    } else {
        bodyParsed = body;
    }
    /**
     * Validación de Token
     */
    const { authorization = '' } = req.headers;
    console.log(authorization);
    if (!authorization) {
        return res.status(401).json({ status: 401, error: true, message: 'No se recibio un token de sesión' });
    }
    const decodedToken: any = validateToken(authorization);
    console.log('decodedToken')
    console.log(decodedToken)
    if (!decodedToken) {
        return res.status(401).json({ status: 401, error: true, message: 'Token de Sesión Invalido' });
    }

    /**
     * Acciónes de método
     */
    switch (method) {
        case 'POST':
            const createResult = await userCreate(bodyParsed);
            return res.status(createResult.status).json(createResult);
        case 'PATCH':
            //const modifyResult = await salesModify(await req.json());
            //return res.json(modifyResult);
            return res.status(200).json({ status: 200, error: false, message: 'PATCH not implemented' });
        case 'DELETE':
            //const categoriaId = Number(searchParams.get('id') ?? 0);
            //const deleteResult = await salesDelete(categoriaId);
            return res.status(200).json({ status: 200, error: false, message: 'DELETE not implemented' });
        default:
            res.setHeader('Allow', ['POST', 'PATCH', 'DELETE']);
            return res.status(405).json({ status: 200, error: true, message: `Method ${method} Not Allowed` });
    }
}
