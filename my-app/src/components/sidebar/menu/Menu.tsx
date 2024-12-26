import React, {useState} from 'react';
import MenuItem from './MenuItem';
import {MENU} from "./menu.data"
import classes from '../Sidebar.module.scss';

const Menu = ({isCollapsed}: {isCollapsed: boolean}) => {

  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));

  const FarmerPages = [
    'Home',
    'Farmers',
    'Orders',
    'Dashboard',
    'Negotiations'
  ]
  const BuyerPages = [
    'Farmers',
    'Orders',
    'Products',
    'ShoppingCart',
    'Negotiations'
  ]
  return (
    <nav className={classes.menu}>
        {MENU.map(item=>{
          if (user.role=='Farmer' && FarmerPages.includes(item.name)){
            return <MenuItem item={item} isCollapsed={isCollapsed}/>
          }else if (user.role=='Buyer' && BuyerPages.includes(item.name)){
            return <MenuItem item={item} isCollapsed={isCollapsed}/>
          }
        })}
    </nav>
  )
}

export default Menu;