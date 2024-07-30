import { toastOptions } from "@/components/utils";
import validateToken from "@/middlewares/validateToken";
import { GetServerSideProps } from "next";
import { toast } from "react-toastify";

export const serverSideProps: GetServerSideProps = async (context: any) => {
    const { token }: any = context.req.cookies;
    if (!token) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    } else {
        const validatedToken = await validateToken(token);
        if (!validatedToken) {
            console.log('validatedToken is not valid /SSP function');
            console.log(validatedToken);
            return {
                props: {
                    tokenIsValid: false
                },
            };
        } else {
            console.log('validatedToken is valid /SSP function');
            console.log(validatedToken);
            return {
                props: {
                    validatedToken,
                    tokenIsValid: true
                },
            };
        }
    }
};
