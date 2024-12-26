import React from 'react'
import { Outlet } from 'react-router'
import MyProducts from './MyProducts'
import ProductModal from './ProductModal'

const ProductsLayout = () => {
  return (
    <div className='relative w-full'>
        <MyProducts/>
        <Outlet/>
    </div>
  )
}

export default ProductsLayout