import React from 'react';
import { domAnimation, LazyMotion } from 'framer-motion';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.tsx';
import Home from './components/home/Home.tsx';
import About from './components/about/About.tsx';
import Login from './components/auth/login/Login.tsx';
import Register from './components/auth/register/Register.tsx';
import Main from './components/main/Main.tsx';
import './App.scss';
import './styles.css';
import Farmers from './components/farmers/Farmers.tsx';
import Farmer from './components/farmers/Farmer.tsx';
import { FarmerContextProvider } from './components/farmers/FarmerContext.tsx';
import Products from './components/products/Products.tsx';
import Product from './components/products/Product.tsx';
import Orders from './components/orders/Orders.tsx';
import Order from './components/orders/Order.tsx';
import MyProducts from './components/dashboard/myproducts/MyProducts.tsx';
import DashboardLayout from './components/dashboard/DashboardLayout.tsx';
import AuthContextProvider from './contexts/AuthContext.tsx';
import ProtectedRoute from './components/profile/ProtectedRoute.tsx';
import PasswordReset from './components/auth/password-reset/PasswordReset.tsx';
import PasswordResetConfirm from './components/auth/password-reset/PasswordResetConfirm.tsx';
import ProductModal from './components/dashboard/myproducts/ProductModal.tsx';
import ProductsLayout from './components/dashboard/myproducts/ProductsLayout.tsx';
import FarmModal from './components/dashboard/myfarms/FarmModal.tsx';
import ChatLayout from './components/chat/ChatLayout.tsx';
import Chat from './components/chat/Chat.tsx';
import Cart from './components/cart/Cart.tsx';
import ShopContextProvider from './components/cart/ShopContext.tsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    children: [
      {
        path: "/",
        element: <Main/>,
        children: [
          {
            path: "/",
            element: <ProtectedRoute><Home/></ProtectedRoute>
          },
          {
            path: "/chats",
            element: <ProtectedRoute><ChatLayout/></ProtectedRoute>,
            children: [
              {
                path:":channelId",
                element: <Chat/>
              }
            ]
          },
          {
            path: "/cart",
            element: 
            <ProtectedRoute>
              <ShopContextProvider>
                <Cart/>
              </ShopContextProvider>
            </ProtectedRoute>
          },
          {
            path: "/farmers",
            children: [
              {
                path: "",
                element: <Farmers/>,
              },
              {
                path: ":farmerId",
                element: <FarmerContextProvider><Farmer/></FarmerContextProvider>
              }
            ]
          },
          {
            path: "/products",
            children: [
              {
                path: "",
                element: <Products/>,
              },
              {
                path: ":productId",
                element: <Product/>
              }
            ]
          },
          {
            path: "/orders",
            children: [
              {
                path: "",
                element: <ProtectedRoute><Orders/></ProtectedRoute>
              },
              {
                path: ":orderId",
                element: <Order/>
              }
            ]
          },
          {
            path: "/dashboard",
            element: <ProtectedRoute><DashboardLayout/></ProtectedRoute>,
            children: [
              {
                path: "create-product",
                element: <ProductModal/>
              },
              {
                path: "update-product/:productId",
                element: <ProductModal/>
              },
              {
                path: "create-farm",
                element: <FarmModal/>
              },
              {
                path: "update-farm/:farmId",
                element: <FarmModal/>
              }
            ]
          },
          {
            path: "/about",
            element: <About/>
          },
          {
            path: "/settings",
            element: <About/>
          },
        ]
      }
    ]
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "/password-reset",
    element: <PasswordReset/>
  },
  {
    path: "/password-reset-confirm/:confirm_token",
    element: <PasswordResetConfirm/>
  },
]);

const App = () => {
  return (
    <AuthContextProvider>
      <LazyMotion features={domAnimation}>
        <RouterProvider router={router} />
      </LazyMotion>
    </AuthContextProvider>
  )
}

export default App;


