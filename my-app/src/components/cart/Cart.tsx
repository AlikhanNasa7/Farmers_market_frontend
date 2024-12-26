import { useContext, useEffect, useState } from 'react';
import { ShopContext } from './ShopContext';
import './CartItems.css'
import React from 'react'
import useAxiosWithIntercepter from '../../helpers/jwtintercepters';
import axios from 'axios';
import { X } from 'lucide-react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    //const {allProducts, cartItems, addToCart, removeFromCart, getTotalCartAmount,decreaseFromCart} = useContext(ShopContext);
    // const totalCart = getTotalCartAmount();

    // function removeHandler(id){
    //     removeFromCart(id);
    // }
    // function structureItem(item){
    //     const quantity = cartItems[item.id];
    //     const totalPrice = quantity * item.new_price;
    //     return (
    //         <div className='cartitems-item'>
    //             <img src={item.image} alt="" />
    //             <p>{item.name}</p>
    //             <p>{item.new_price}</p>
    //             <button>{quantity}</button>
    //             <p>{totalPrice}</p>
    //             <img src={remove_icon} onClick={()=>removeHandler(item.id)} alt="" />
    //         </div>)
    // }

    const axiosInstance = useAxiosWithIntercepter();

    const [allProducts, setAllProducts] = useState([]);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function fetchCart(){
        const response = await axiosInstance.get(
            "http://127.0.0.1:8000/carts/get/"
        );
        
        const data = response.data;
        console.log(data)
        setAllProducts(data);
        //setUser(data.user)
    }

    useEffect(()=>{
        fetchCart();
    },[]);

    async function createOrder(){
        //setLoading(true);
        const response = await axiosInstance.post('http://127.0.0.1:8000/orders/create-order/');
        if (response.status==201){
            navigate('/orders');
        }
        // setLoading(false);
    }

    const deleteCartItem = async (cart_item_id) => {
        const response = await axiosInstance.delete(`http://127.0.0.1:8000/carts/${cart_item_id}/delete-item/`,{
            'cart_item_id': cart_item_id
        });

        if (response.status===202 || response.status===200){
            fetchCart();
        }

    }

    const retractCartItem = async (cart_item_id) => {
        const response = await axiosInstance.put(`http://127.0.0.1:8000/carts/retract-item/`,{
            'cart_item_id': cart_item_id
        });

        if (response.status===202 || response.status===200){
            fetchCart();
        }

    }

    const addCartItem = async (product_id, quantity) => {
        const response = await axiosInstance.post(`http://127.0.0.1:8000/carts/add-item/`,{
            'product_id': product_id,
            'quantity': quantity
        });

        console.log(response);

        fetchCart();
    }

    const columns: GridColDef[] = [
        {
          headerName: 'Product',
          flex: 2,
          renderCell: (value, row)=>{
            return (
                <Link to={`/products/${value.row.product_id}`}>
                    <div className='flex gap-2'>
                        <img src={value.row.product_image} alt="" className='w-12 h-12 rounded-full'/>
                        <p>{value.row.product.name}</p>
                    </div>
                </Link>
            )
          }
        },
        {
          field: 'unit',
          headerName: 'Unit type',
          flex: 0.5,
          editable: false,
          valueGetter: (value, row) => {
            return row.product.unit_name
          }
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 1.5,
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            flex: 1,
            editable: false,
            align: 'center',
            headerAlign: 'center',
            renderCell: (value, row) => {
                console.log(value)
                return (
                    <div className='flex text-lg h-full gap-4'>
                        <button onClick={()=>retractCartItem(value.row.cart_item_id)}>-</button>
                        <button disabled>{value.row.quantity}</button>
                        <button onClick={()=>addCartItem(value.row.product_id, 1)}>+</button>
                    </div>
                )
            }
        },
        {
            field: 'farm',
            headerName: 'Farm',
            flex: 2,
            editable: false,
            renderCell: (value, row)=>{
                let image = value.row.farm_image;
                if (!image.includes("http://")){
                    image = "http://127.0.0.1:8000/" + image;
                }
                console.log(image);
                return (
                    <Link to={`/farmers/${value.row.farm.farmer_id}`}>
                        <div className='flex gap-2'>
                            <img src={image} alt="" className='w-12 h-12 rounded-full'/>
                            <p>{value.row.farm.farm_name}</p>
                        </div>
                    </Link>
                )
            }
        },
        {
            field: 'total_price',
            headerName: 'Total Price',
            flex: 1
          },
        {
          field: 'actions',
          headerName:'Actions',
          type: 'actions',
          flex:0.5,
          getActions: (params) => [
            <GridActionsCellItem
              icon={<Trash2 color='rgb(233, 63, 57)' />}
              label="delete"
              onClick={()=>deleteCartItem(params.row.cart_item_id)}
            />,
          ],
        }
    ];

    let rowsWithIds = [];

    if (allProducts){
        rowsWithIds = allProducts.map((row, index) => ({
        ...row,
        id: index
        }));
    }
    

    return (
        <div className='w-full p-12'>
            <h4 className='text-3xl font-bold mb-8'>Cart Items</h4>
            <Box sx={{ height: 520, width: '80%', margin: 'auto'}}>
            <DataGrid
              rows={rowsWithIds}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 8,
                  },
                },
              }}
              // sx={{
              //   '& .MuiDataGrid-rows': {
              //     padding: '16px',
              //   },
              // }}
              pageSizeOptions={[8]}
              checkboxSelection
              disableRowSelectionOnClick
              //processRowUpdate={updateFarm}
            />
          </Box>
            <div className='cartitems-down'>
                <div className='cartitems-total'>
                    {allProducts.length>0 && <button onClick={createOrder} className='cartitems-total-action'>Create Order</button>}
                </div>
            </div>
        </div>
    )
}

export default Cart