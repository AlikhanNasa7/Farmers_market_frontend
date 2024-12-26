import React, {useEffect, useState} from 'react';
import {
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Box, 
    Typography,
    Avatar,
    ListItemAvatar
} from '@mui/material';
import useAxiosWithIntercepter from '../../helpers/jwtintercepters';
import { Link } from 'react-router-dom';
import { useAuthService } from '../../services/AuthService';

const Chats = () => {

    const [loading, setLoading] = useState(false);

    const axiosInstance = useAxiosWithIntercepter();

    const [chatRooms, setChatRooms] = useState([]);

    const {user} = useAuthService();

    useEffect(()=>{
        async function fetchChats(){
            try {
                setLoading(true);
                const response = await axiosInstance.get(`http://127.0.0.1:8000/chat/chatrooms/`);
                console.log(response.data);
                setChatRooms(response.data);
                // const rooms = response.data.map(chatRoom => chatRoom.user1.email === user.email ? chatRoom.user1.email : chatRoom.user2.email);
                // console.log(123412341234);
                // console.log(rooms);
                // setChatRooms(rooms);
              } catch (error) {
                //react-toasts should show messages
              } finally {
                setLoading(false);
              }
        }
        fetchChats();
    },[]);

    console.log(chatRooms)



    return (
        <div className='h-[calc(100%)-] border border-r-slate-300'>
            <div className='w-full bg-slate-400 h-[50px] flex'>
                <h4 className='font-bold text-2xl'>Chats</h4>
            </div>
            {chatRooms && chatRooms.map(item=>(
                    <ListItem key={item.id} disablePadding sx={{display: "block"}} dense={true}>
                        <Link to={`/chats/${item.id}/`} style={{textDecoration: "none", color: "inherit"}}>
                            <ListItemButton sx={{minHeight: 0}}>
                                <ListItemIcon sx={{minHeight: 0}}>
                                    <ListItemAvatar sx={{minHeight: "50px", justifyContent:"start", alignItems:"center", display:'flex'}}>
                                        <Avatar alt='Server Avatar' src={`${item.user2.profile.image}`}>

                                        </Avatar>
                                    </ListItemAvatar>
                                </ListItemIcon>
                                <ListItemText 
                                    primary={
                                        <Typography 
                                            variant="body2" 
                                            sx={{
                                                fontWeight: 700, 
                                                lineHeight: 1.2, 
                                                textOverflow:"ellipsis",
                                                whiteSpace: "nowrap"
                                            }}
                                        >{item.user2.email}</Typography>
                                    }
                                    secondary={
                                        <Typography 
                                            variant="body2" 
                                            sx={{
                                                fontWeight: 500, 
                                                lineHeight: 1.2, 
                                                color: "textSecondary"
                                            }}
                                        >{item.category}</Typography>
                                    }
                                    sx={{opacity: 1}}
                                    />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
        </div>
    )
}

export default Chats