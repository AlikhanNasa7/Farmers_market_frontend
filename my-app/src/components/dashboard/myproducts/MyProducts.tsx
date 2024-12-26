import React, { useEffect, useState } from 'react';
import FarmerProduct from '../../farmers/FarmerProduct';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Trash2, Pencil } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useAuthService } from '../../../services/AuthService';
import useAxiosWithIntercepter from '../../../helpers/jwtintercepters';

interface FarmerProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  category: string;
}

const products: FarmerProduct[] = [
  {
    id: "1",
    name: "Organic Tomatoes",
    description: "Freshly picked organic tomatoes from the farm.",
    price: 3.99,
    quantity: 50,
    unit: "kg",
    category: "Vegetables",
  },
  {
    id: "2",
    name: "Free-Range Eggs",
    description: "Dozen of free-range eggs, naturally sourced.",
    price: 5.50,
    quantity: 30,
    unit: "dozen",
    category: "Dairy",
  },
  {
    id: "3",
    name: "Raw Honey",
    description: "Pure, unprocessed honey directly from beehives.",
    price: 12.00,
    quantity: 20,
    unit: "bottle",
    category: "Honey",
  },
  {
    id: "4",
    name: "Fresh Strawberries",
    description: "Seasonal, hand-picked strawberries from local fields.",
    price: 8.99,
    quantity: 15,
    unit: "box",
    category: "Fruits",
  },
  {
    id: "5",
    name: "Farm Fresh Milk",
    description: "Full-fat, non-pasteurized milk directly from cows.",
    price: 2.99,
    quantity: 100,
    unit: "liter",
    category: "Dairy",
  },
  {
    id: "6",
    name: "Organic Potatoes",
    description: "Healthy, pesticide-free potatoes straight from the ground.",
    price: 2.50,
    quantity: 200,
    unit: "kg",
    category: "Vegetables",
  }
];



const MyProducts = () => {
  const [data, setData] = useState<FarmerProduct[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const access_token = sessionStorage.getItem("access_token");

  const axiosInstance = useAxiosWithIntercepter();

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/products/farmer', {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      //react-toasts should show messages
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`http://127.0.0.1:8000/products/${id}/`);
      if (response.status===200){
        //show message about successfull deletion of the product
        fetchData();
      }
    } catch (error) {
      //react-toasts should show messages
    }
    return 1;
  }

  const updateProduct = async (updatedRow: any) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/products/${updatedRow.id}`,
        updatedRow
      );

      setData((prevData) =>
        prevData && prevData.map((row) => (row.id === updatedRow.id ? updatedRow : row))
      );

      return updatedRow;
    } catch (error) {
      console.error('Error updating user', error);
      //react-toasts to notify about the crud status
      return null;
    }
  };

  useEffect(()=>{
    fetchData();
  },[]);

  const columns: GridColDef<FarmerProduct>[] = [
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1,
      editable: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.2,
      editable: true,
    },
    {
      field: 'farm_name',
      headerName: 'Farm',
      flex: 1.2,
      editable: false,
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      flex: 0.5,
      editable: true,
      //valueGetter: (params) => `$${params.value.toFixed(2)}`, // Format price as currency
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      flex: 0.5,
      editable: true,
    },
    {
      field: 'unit_name',
      headerName: 'Unit',
      flex: 0.5,
      editable: true,
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      editable: false,
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
          onClick={()=>deleteProduct(params.row.product_id)}
        />,
        <GridActionsCellItem
          icon={<Pencil color='rgb(57, 57, 203)' />}
          label="edit"
          onClick={()=>navigate(`update-product/${params.row.product_id}`)}
        />
      ],
    }
  ];
  let rowsWithIds = [];

  if (data){
    rowsWithIds = data.map((row, index) => ({
      ...row,
      id: index
    }));
  }


  return (
    <div className='content-area-table m-auto p-16 w-full'>
        <div className='data-table-title w-full flex justify-between'>
            <h4 className='text-3xl font-semibold mb-6'>My Products </h4>
            <button className='py-2 px-3 rounded-lg bg-blue-800 text-white h-fit' onClick={()=>navigate("create-product")}>+Add Product</button>
        </div>
        <Box sx={{ height: 520 }}>
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
            processRowUpdate={updateProduct}
          />
        </Box>
    </div>
  )
}

export default MyProducts