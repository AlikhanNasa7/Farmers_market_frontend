import useWebSocket from 'react-use-websocket';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuthService } from '../../services/AuthService';
import useAxiosWithIntercepter from '../../helpers/jwtintercepters';
const useChatService = (channelId) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const axiosInstance = useAxiosWithIntercepter()
    const {updateToken} = useAuthService();

    const {user} = useAuthService()
    console.log(user);

    const socketUrl = channelId ? `ws://127.0.0.1:8000/ws/chat/${channelId}/?token=${sessionStorage.getItem('access_token')}` : null;

    const [reconnectAttempt, setReconnectAttempt] = useState(0);
    const maxReconnectAttempts = 4;


    console.log(message, messages)


    const fetchMessages = async () => {
        const response = await axiosInstance.get(`http://127.0.0.1:8000/chat/chatrooms/${channelId}/messages/`);
        return response.data;
    };
    
    const {sendJsonMessage} = useWebSocket(`${socketUrl}`, {
        onOpen: async () => {
            try {
                const data = await fetchMessages();
                setMessages([]);
                setMessages(Array.isArray(data) ? data : []);
                console.log("Connected");
            } catch(error){
                console.log("Error!", error);
            }
        },
        onClose: async (event) => {
            if (event.code==4001){
                console.log("Authentication error");
                const data = await updateToken();
                if (data.status==401){
                    //logout();
                }
            }
            console.log("Closed!");
            setReconnectAttempt(prev => prev+1);
        },
        onError: (e) => {
            console.log(e)
            console.log("Error Appeared!!!")
        },
        onMessage: (msg) => {
            const data = JSON.parse(msg.data);
            console.log(data);
            setMessages(prev=> [...prev, data.new_message]);
        },
        shouldReconnect: (closeEvent) => {
            if (closeEvent.code==4001 && reconnectAttempt>=maxReconnectAttempts){
                return false;
            }else{
                return true;
            }
        },
        reconnectInterval: 1000
    });

    return {message, messages, setMessage, sendJsonMessage}
    
}


export default useChatService;