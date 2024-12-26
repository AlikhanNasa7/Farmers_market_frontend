import React from 'react'
import { Outlet } from 'react-router'
import DashboardSidebar from './DashboardSidebar'
import MyProducts from './myproducts/MyProducts'
import MyFarms from './myfarms/MyFarms'

const DashboardLayout = () => {
  return (
    <div className='flex flex-col'>
      <MyFarms/>
      <MyProducts/>
      <Outlet/>
    </div>
  )
}

export default DashboardLayout