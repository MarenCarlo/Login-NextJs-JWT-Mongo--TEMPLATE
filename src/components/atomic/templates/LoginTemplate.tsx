import React from 'react'
import { useState } from "react";
import { useRouter } from "next/router";
import { createSession } from '@/services';
import { useUser } from "@/context/UserContext";
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
import { InputText } from '@/components/atomic/atoms/Inputs';
import { toast } from 'react-toastify';
import { toastOptions } from '@/components/utils';

const LoginTemplate = () => {
    const router = useRouter();
    const { login } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({
        nameUser: '',
        passUser: '',
    });
    const [errorData, setErrorData] = useState({});

    const handleRedirect = () => {
        return router.push('/sales');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const loginForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await createSession(userData).then(({ status, error, message, data }) => {
                setIsLoading(false);
                if (error === true) {
                    setErrorData({ status, error, message, data });
                    setIsLoading(false);
                    toast.error(`${message}`, toastOptions);
                    console.log(`${status} - ${message}`);
                } else {
                    if (data.token) {
                        const decodedToken: any = jwt.decode(data.token);
                        console.log('decodedToken /login');
                        console.log(decodedToken);
                        if (decodedToken) {
                            login(decodedToken);
                        }
                    }
                    Cookies.set('token', data.token, { expires: 1 / 3 });
                    toast.success('Sesión Iniciada', toastOptions);
                    handleRedirect();
                }
            });
        } catch (error) {
            console.log(error)
        }
    };
    return (
        <div>
            <div className="flex flex-col items-center justify-center mt-[-40px] mx-auto h-screen">
                <div className=" w-full rounded-lg sm:max-w-md">
                    <div className="px-6 space-y-4 md:space-y-6">
                        <h1 className="text-xl font-bold tracking-tight text-gray-900 md:text-3xl">
                            Inicia Sesión
                        </h1>
                        <form className="space-y-4 md:space-y-2" onSubmit={loginForm}>
                            <InputText
                                label="Usuario"
                                required={true}
                                onChange={handleChange}
                                type="text"
                                placeholder="Usuario"
                                value={userData.nameUser}
                                name="nameUser"
                                labelClassName='block mb-2 text-sm font-medium text-gray-900'
                                inputClassName='
                                    bg-gradient-to-r from-white to-gray-100 rounded-lg 
                                    block w-full p-3
                                    shadow-xl hover:shadow-md
                                    transition duration-500
                                '
                            />
                            <InputText
                                label="Contraseña"
                                required={true}
                                onChange={handleChange}
                                type="password"
                                placeholder="••••••••"
                                value={userData.passUser}
                                name="passUser"
                                labelClassName='block mb-2 text-sm font-medium text-gray-900'
                                inputClassName='
                                    bg-gradient-to-r from-white to-gray-100
                                    text-gray-900 rounded-lg block w-full p-3 mb-5
                                    shadow-xl hover:shadow-md
                                    transition duration-500
                                '
                            />
                            <button
                                type="submit"
                                className="
                                    w-full text-white 
                                    bg-gradient-to-r from-purple-700 to-indigo-700
                                    font-medium rounded-lg px-5 py-3 text-center text-base 
                                    shadow-md hover:shadow-xl
                                    hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-400
                                    transition duration-500"
                            >
                                {isLoading ? (
                                    'Loading'
                                ) : (
                                    'Ingresar'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginTemplate
