import React, {createContext, useEffect, useState} from "react";
export const ShopContext = createContext(null)
import useAxiosWithIntercepter from "../../helpers/jwtintercepters";

function getDefaultCart(){
    let cart = {};

    for (let i =0;i<300;i++){
        cart[i] = 0;
    }
    return cart;
}

const ShopContextProvider = (props)=>{

    const axiosInstance = useAxiosWithIntercepter();

    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [allProducts, setAllProducts] = useState([]);
    // useEffect(()=>{
    //     axiosInstance.get('http://127.0.0.1:8000/allproducts')
    //     .then(response=>response.json())
    //     .then(data=>{
    //         setAllProducts(data);
    //     });

    //     if (localStorage.getItem('auth-token')){
    //         fetch('http://localhost:8000/getcart', {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'auth-token': `${localStorage.getItem('auth-token')}`
    //             }
    //         })
    //         .then(response=>response.json())
    //         .then(data=>setCartItems(data));

    //     }
    // },[]);

    function addToCart(itemId){
        let errorMessage;
        let successMessage = "Added to Cart";
        if (localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    'Accept': 'application/form-data',
                    'Content-Type': 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`
                },
                body: JSON.stringify({itemId:itemId})
            })
            .then(response=>response.json())
            .then(data=>{
                setCartItems((prev)=>({...prev, [itemId]:prev[itemId]+1}));
            }).catch(error=>errorMessage=error);
        }else{
            return {error:"You are not authorized", message: "Please authorize"}
        }
        return errorMessage ? {error:"Could not add product", message: errorMessage} : {success: "Added product", message: successMessage}
    }

    function removeFromCart(itemId){
        fetch('http://localhost:4000/removefromcart', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth-token' : `${localStorage.getItem('auth-token')}`
            },
            body: JSON.stringify({itemId:itemId})
        })
        .then(response=>response.json())
        .then(data=>{
            console.log(data);
            setCartItems((prev)=>({...prev, [itemId]: 0}));
        })
    }
    function getTotalCartAmount(){
        let totalAmount = 0;
        for (let item in cartItems){
            if (cartItems[item]){
                let itemInfo = allProducts.find(product=>product.id==item);
                console.log(itemInfo);
                totalAmount += cartItems[item]*itemInfo.new_price;
            }
        }
        return Math.round(totalAmount*100)/100;
    }
    function getTotalCartItems(){
        let totalItems = 0;
        for (let item in cartItems){
            if (cartItems[item]) totalItems++;
        }
        return totalItems;
    }
    function decreaseFromCart(itemId){
        console.log(itemId);
        fetch('http://localhost:4000/decreasefromcart', {
            method: 'POST',
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/json',
                'auth-token': `${localStorage.getItem('auth-token')}`
            },
            body: JSON.stringify({itemId:itemId})
        })
        .then(response=>response.json())
        .then(data=>{
            console.log(data);
            setCartItems((prev)=>({...prev, [itemId]: prev[itemId]-1}));
        })
    }
    const contextValue = {allProducts, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems, decreaseFromCart};
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;