import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const validateToken = (token: string) => {
    try {
        const secret = process.env.NEXT_PUBLIC_JWT_TOKEN_SECRET as Secret;
        const decoded = jwt.verify(token, secret) as JwtPayload;
        return decoded;
    } catch (error) {
        console.error('Invalid or expired token:', error);
        return null;
    }
};

export default validateToken;