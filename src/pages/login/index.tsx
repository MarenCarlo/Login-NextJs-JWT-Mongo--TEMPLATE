"use client"

import LoginTemplate from "@/components/atomic/templates/LoginTemplate";
import { GetServerSideProps } from "next";

export default function Login() {


    return (
        <section>
            <LoginTemplate />
        </section>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { token }: any = context.req.cookies;
    if (token) {
        return {
            redirect: {
                permanent: false,
                destination: '/sales',
            },
        };
    }
    return { props: {} };
};
