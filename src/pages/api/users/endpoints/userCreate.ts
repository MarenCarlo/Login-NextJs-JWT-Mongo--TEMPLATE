/**
 * @param {Json} req - data de usuario a crear
 * @returns 
 */

/**
 * Librerias
 */
import Joi from "joi";
import bcrypt from "bcrypt";

/**
 * Funciones
 */
import { connectDB } from '@/utils/connection';

/**
 * Modelos
 */
import User from '@/models/users';

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

export default async function userCreate(req: UserRequest): Promise<SessionResult> {
    try {
        const { error } = schemaUser.validate(req);
        if (error) {
            /**
             * Deteccion de errores de data en los formularios.
             */
            return {
                status: 400,
                error: true,
                message: error.details[0].message,
                data: {}
            }
        } else {
            /**
             * Detección de Usuario Existente en BD
             */
            connectDB();
            let userData = req;
            let usersList = await User.findOne({
                username: new RegExp(`^${userData.nameUser}$`, 'i')
            });
            if (usersList) {
                return {
                    status: 400,
                    error: true,
                    message: `El Usuario '${usersList.username}' ya existe en la BD.`,
                    data: {
                        username: usersList.username
                    }
                }
            } else {
                /**
                 * Encriptación de Contraseñas de Usuarios
                 */
                const salt = await bcrypt.genSalt(10);
                const hashedPass = await bcrypt.hash(userData.passUser, salt);

                /**
                 * Grabación de la Data en BD.
                 */
                const userDataToDB = new User({
                    username: userData.nameUser,
                    password: hashedPass
                })
                try {
                    const userDB = await userDataToDB.save();
                    return {
                        status: 201,
                        error: false,
                        message: 'Usuario Creado Correctamente!',
                        data: {
                            userId: userDB._id,
                            userName: userDB.username
                        }
                    }
                } catch (error) {
                    return {
                        status: 500,
                        error: true,
                        message: `Sucedió un error al momento de guardar en BD al nuevo usuario`,
                        data: {
                            error_data: error
                        }
                    }
                }

            }
        }
    } catch (err: any) {
        return {
            status: 500,
            error: true,
            message: 'Error en el servidor creando el usuario.',
            data: [err.toString()]
        }
    }
}