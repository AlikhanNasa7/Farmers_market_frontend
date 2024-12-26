import React, {ReactNode, useEffect, useState} from 'react';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../../contexts/AuthContext';
const ProtectedRoute = ({children}: {children: ReactNode}) => {
    
    const {isLoggedIn} = useAuthContext();
    const navigate = useNavigate();

    console.log(21341234, isLoggedIn);

    useEffect(()=>{
        if (!isLoggedIn){
            return navigate("/login");
        }
    }, [isLoggedIn]);
    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoute
