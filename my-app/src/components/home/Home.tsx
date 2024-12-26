import React from 'react';
import Dashboard from './Dashboard';
import { useAuthService } from '../../services/AuthService';

const Home = () => {

  const {user} = useAuthService();

  console.log(user);
  return (
    <div className='bg-white h-screen w-full p-16'>
      {/** Greetings */}
      <Dashboard/>
    </div>
  )
}

export default Home