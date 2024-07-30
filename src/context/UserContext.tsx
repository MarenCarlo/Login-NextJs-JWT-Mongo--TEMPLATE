import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
import validateToken from '@/middlewares/validateToken';
import { useRouter } from 'next/router';
import { serverSideProps } from "@/utils/serverProps";
import { toastOptions } from '@/components/utils';
import { toast } from 'react-toastify';

type User = {
    userMessage?: string,
    userId: number,
    userName: string
};

type UserContextType = {
    user: User | null;
    login: (userData: any) => void;
    logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        Cookies.remove('token');
    };

    const validateAndLogToken = async () => {
        const jwtTokenFromCookies: any = Cookies.get('token');
        console.log(jwtTokenFromCookies)
        if (jwtTokenFromCookies) {
            const decodedToken = await jwt.decode(jwtTokenFromCookies);
            if (decodedToken !== null) {
                console.log('USER CONTEXT decoded token !== null')
                console.log(decodedToken)
                setUser(decodedToken as User);
            } if (decodedToken === null || decodedToken === undefined) {
                console.log('USER CONTEXT decoded token === null')
                console.log(decodedToken)
                setUser(null);
                Cookies.remove('token');
                return router.push('/login');
            }
        } else {
            Cookies.remove('token');
        }
    };

    useEffect(() => {
        validateAndLogToken();
    }, []);

    return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser debe ser usado dentro de un UserProvider');
    }
    return context;
};

/**
 * IMPORTANTE!!!!!!
 * INVESTIGAR COMO CONSUMIR UN SERVERSIDE PROPS DESDE UN COMPONENTE CONTENEDOR
 */
export const getServerSideProps = async (ctx: any) => {
    console.log('xd')
    return {
        ...await serverSideProps(ctx)
    };
};