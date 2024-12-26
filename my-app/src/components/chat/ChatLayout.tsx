import React from 'react'
import Chat from './Chat'
import Chats from './Chats'
import ChannelSidebar from './ChannelSidebar'
import { Outlet } from 'react-router'
const ChatLayout = () => {
  return (
    <div className='flex w-full'>
        <div className='w-1/4 h-full'>
            <Chats/>
        </div>
        <div className='w-3/4 h-full'>
            <Outlet/>
        </div>
    </div>
  )
}

export default ChatLayout