import { AuthServiceProps } from "../@types/auth-service";
import axios from "axios";
import React, {useState} from "react"
import { RegisterValues, Role } from "../@types/auth-service";

export function useAuthService(): AuthServiceProps {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn'));
    const [accessToken, setAccessToken] = useState(undefined);
    const [user, setUser] = useState();


    console.log(isLoggedIn, user);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/user/login/", {
                    email,
                    password
                },
                { withCredentials: true }
            );
            
            const data = response.data;
            setAccessToken(data.access);
            setUser(data.user);
            sessionStorage.setItem('user', JSON.stringify(data.user));
            console.log(data.user)
            sessionStorage.setItem("access_token", data.access);
            localStorage.setItem("isLoggedIn", "true");
            setIsLoggedIn("true");
        } catch (err: any){
            console.log(123123123123);
            return err;
        }
    }

    let updateToken = async () => {
        let response = await axios.post('http://127.0.0.1:8000/user/refresh-token/',
            {},
            {withCredentials: true}
        );
        const data = response.data;

        if (response.status===200){
            console.log(data);
            setUser(data.user);
            setAccessToken(data.access);
            sessionStorage.setItem("access_token", data.access);
        }

        return {'status':response.status, data};
    }

    const register = async (email: string, name: string , surname: string, role: Role, password: string) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/user/register/", {
                    email,
                    "first_name": name,
                    "last_name": surname,
                    role,
                    password
                },
                { withCredentials: true }
            );
            console.log(response);
            localStorage.setItem("message", "true");
            return response;
        } catch (err: any){
            console.log(123123123123);
            return err;
        }
    }
    return {login, register, isLoggedIn, accessToken, user, updateToken};
}