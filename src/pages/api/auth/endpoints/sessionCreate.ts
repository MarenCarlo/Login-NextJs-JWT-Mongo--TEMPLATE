import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Funciones
 */
import { connectDB } from '@/utils/connection';

/**
 * Modelos
 */
import User from '@/models/users';
import { secondsToMidnight } from "@/utils/secondsToMidnight";

/**
 * Variables de Entorno
 */
const secretToken = process.env.NEXT_PUBLIC_JWT_TOKEN_SECRET as string;

/**
 * Interfaces
 */
interface UserRequest {
    nameUser: string;
    passUser: string;
}

interface SessionResult {
    status: number;
    error: boolean;
    message: string;
    data: {
        header?: string;
        token?: string;
        userName?: string;
        userId?: string;
        [key: string]: any;
    };
}

/**
 * Objetos joi para ejecutar validaciones correspondientes de la data ingresada.
 */
const schemaUser = Joi.object({
    nameUser: Joi.string().min(8).max(16).pattern(/^\S*$/).required().messages({
        'string.base': 'El nombre de usuario debe ser de tipo String',
        'string.min': 'El nombre de usuario debe tener al menos 8 caracteres',
        'string.max': 'El nombre de usuario no debe tener más de 16 caracteres',
        'string.empty': 'El nombre de usuario es obligatorio',
        'string.pattern.base': 'El nombre de usuario no debe contener espacios',
        'required': 'El nombre de usuario es obligatorio',
    }),
    passUser: Joi.string().min(8).max(32).pattern(/^\S*$/).required().messages({
        'string.base': 'La Contraseña debe ser de tipo string',
        'string.min': 'La Contraseña debe tener al menos 8 caracteres',
        'string.max': 'La Contraseña no debe tener más de 32 caracteres',
        'string.empty': 'La Contraseña es obligatoria',
        'string.pattern.base': 'La Contraseña no debe contener espacios',
        'required': 'La Contraseña es obligatoria',
    }),
});

/**
 * @param {UserRequest} req - data de usuario iniciando sesion
 * @returns {Promise<SessionResult>}
 */
export default async function sessionCreate(req: UserRequest): Promise<SessionResult> {
    try {
        const { error } = schemaUser.validate(req);
        if (error) {
            /**
             * Detección de errores de data en los formularios.
             */
            return {
                status: 400,
                error: true,
                message: error.details[0].message,
                data: {}
            };
        } else {
            /**
             * Detección de Usuario Existente en BD
             */
            await connectDB();
            const userDataDB = await User.findOne({
                username: new RegExp(`^${req.nameUser}$`, 'i')
            });
            if (userDataDB) {
                /**
                 * Comparación de Hash de Contraseña
                 */
                const validPassword = await bcrypt.compare(req.passUser, userDataDB.password);
                if (!validPassword) {
                    return {
                        status: 400,
                        error: true,
                        message: 'La contraseña es incorrecta...',
                        data: {}
                    };
                } else {
                    const currentTime = new Date();
                    const expirationTime = secondsToMidnight(currentTime);
                    const token = jwt.sign({
                        userId: userDataDB._id,
                        userName: userDataDB.username,
                        expirationTime
                    }, secretToken, {
                        expiresIn: expirationTime
                    });
                    return {
                        status: 200,
                        error: false,
                        message: `Sesión Creada Exitosamente`,
                        data: {
                            header: 'authorization',
                            token,
                            userName: userDataDB.username,
                            userId: userDataDB._id
                        }
                    };
                }
            } else {
                /**
                 * Manejo de inexistencia de Usuario en BD
                 */
                return {
                    status: 400,
                    error: true,
                    message: `Ese Nombre de Usuario no existe en la BD.`,
                    data: {}
                };
            }
        }
    } catch (err: any) {
        return {
            status: 500,
            error: true,
            message: 'Error en el servidor iniciando la sesión.',
            data: { error: err.toString() }
        };
    }
}