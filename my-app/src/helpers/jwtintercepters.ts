import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BASE_URL } from "../config";
import axios, { AxiosInstance } from "axios";

const API_BASE_URL = BASE_URL;

const useAxiosWithIntercepter = (): AxiosInstance => {
    const jwtAxios = axios.create({baseURL: API_BASE_URL});
    const navigate = useNavigate();

    const [error, setError] = useState(null);

    jwtAxios.interceptors.request.use(
        (config) => {
            const accessToken = sessionStorage.getItem('access_token');
            if (accessToken) {
              config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
          
        },
        async (error) => {
            const originalRequest = error.config;
            console.log(originalRequest);
            
            if (error.response?.status === 401){
                const goRoot = () => navigate("/");
                goRoot();
            }
        }
    )

    jwtAxios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;
            console.log(originalRequest);
            console.log(error.response?.status, originalRequest._retry)

            if (error.response?.status === 401){
                //originalRequest._retry = true;

                try {
                    const refreshResponse = await axios.post('http://127.0.0.1:8000/user/refresh-token/', {}, {withCredentials: true});
                    
                    const newAccessToken = refreshResponse.data.access;

                    sessionStorage.setItem("access_token", newAccessToken);

                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    return jwtAxios(originalRequest);
                } catch(refreshError){
                    sessionStorage.removeItem("access_token");
                    localStorage.removeItem("isLoggedIn");
                    navigate("/login");
                    return Promise.reject(refreshError);
                }

            }

            return Promise.reject(error);
        }
    )
    return jwtAxios;
}

export default useAxiosWithIntercepter;


