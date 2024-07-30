"use client"
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createSession } from '@/services';
import { useUser } from "@/context/UserContext";
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
import { GetServerSideProps } from "next";
import validateToken from "@/middlewares/validateToken";
import { cookies } from "next/headers";
import { serverSideProps } from "@/utils/serverProps";
import { toast } from "react-toastify";
import { toastOptions } from "@/components/utils";

export default function Sales(tokenInfo: any) {

    const router = useRouter();
    const { user, login, logout } = useUser();
    const [userData, setUserData] = useState<any>({});

    //Session UseEffect
    useEffect(() => {
        let objectTokenValue = Object.values(tokenInfo);
        if (objectTokenValue[1] == false || objectTokenValue[1] == undefined) {
            console.log('tokenInfo error /sales')
            Cookies.remove('token');
            toast.error(`Sesión Expirada!`, toastOptions);
            router.push('/login');
        } else {
            setUserData(objectTokenValue[0]);
        }
    }, [tokenInfo]);

    return (
        <section>
            <div>
                Sales Pages
            </div>
            <div>
                {userData.userName}
            </div>
        </section>
    )
}

export const getServerSideProps = async (ctx: any) => {
    return {
        ...await serverSideProps(ctx)
    };
};