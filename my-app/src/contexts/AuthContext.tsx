import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthServiceProps } from '../@types/auth-service';
import { useAuthService } from '../services/AuthService';


export const AuthContext = createContext<AuthServiceProps | null| {}>({});



const AuthContextProvider = ({children}: {children: React.ReactNode}) => {
    const authService = useAuthService();

    return (
        <AuthContext.Provider value={authService}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext(): AuthServiceProps{
    const context = useContext(AuthContext);

    if (context===null){
        throw new Error("Error - You have to use the AuthContextProvider")
    }

    return context;
}

export default AuthContextProvider;

