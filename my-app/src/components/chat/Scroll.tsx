import styled from '@emotion/styled'
import { Box } from '@mui/material'
import React, { useCallback, useEffect, useReducer, useRef } from 'react'

const MessageScrollBar = styled(Box)(({theme}) => ({
    height: `calc(100vh - 170px)`,
    overflowX: "scroll",
    "&::-webkit-scrollbar": {
        width: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
        borderRadius: "4px",
        backgroundColor: "#888"
    },
    "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "#555"
    },
    "&::-webkit-scrollbar-corner": {
        backgroundColor: "transparent"
    }
}));


const Scroll = ({children}) => {

    const scrollRef = useRef();
    const scrollToBottom = useCallback(()=>{
        if (scrollRef.current){
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    });


    useEffect(()=>{
        scrollToBottom();
    },[scrollToBottom, children]);

    return (
        <MessageScrollBar ref={scrollRef}>
            {children}
        </MessageScrollBar>
    )
}

export default Scroll