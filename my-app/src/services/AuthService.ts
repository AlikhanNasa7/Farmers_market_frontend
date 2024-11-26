import { AuthServiceProps } from "../@types/auth-service";
import axios from "axios";
import React, {useState} from "react"


export function useAuthService(): AuthServiceProps {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn'));
    const [accessToken, setAccessToken] = useState(undefined);

    console.log(isLoggedIn);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/user/login/", {
                    email,
                    password
                },
                { withCredentials: true }
            );
            console.log(response);
            const data = response.data;
            setAccessToken(data.access);
            localStorage.setItem("isLoggedIn", "true");
            setIsLoggedIn("true");
        } catch (err: any){
            console.log(123123123123);
            return err;
        }
    }
    return {login, isLoggedIn, accessToken};
}