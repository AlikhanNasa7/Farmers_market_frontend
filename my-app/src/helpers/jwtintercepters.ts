import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BASE_URL } from "../config";
import axios, { AxiosInstance } from "axios";

const API_BASE_URL = BASE_URL;

const useAxiosWithIntercepter = (): AxiosInstance => {
    const jwtAxios = axios.create({baseURL: API_BASE_URL});
    const navigate = useNavigate();

    jwtAxios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401){
                const goRoot = () => navigate("/");
                goRoot();
            }
        }
    )
    return jwtAxios;
}

export default useAxiosWithIntercepter;


