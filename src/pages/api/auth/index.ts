import type { NextApiRequest, NextApiResponse } from 'next';
import sessionCreate from './endpoints/sessionCreate';
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
    switch (method) {
        case 'POST': {
            const sessionResult: SessionResult = await sessionCreate(bodyParsed);
            if (!sessionResult.error) {
                return res.status(sessionResult.status).json(sessionResult);
            }
            return res.status(sessionResult.status).json(sessionResult);
        }
        case 'DELETE':
            return res.status(200).json({ status: 200, error: false, message: 'DELETE not implemented' });
        default:
            res.setHeader('Allow', ['POST', 'DELETE']);
            return res.status(405).json({ status: 405, error: true, message: `Method ${method} Not Allowed` });
    }
}