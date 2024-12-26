import React, { useEffect, useState } from 'react';
import FarmerProduct from '../../farmers/FarmerProduct';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Trash2, Pencil } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import useAxiosWithIntercepter from '../../../helpers/jwtintercepters';


const MyFarms = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState<boolean>(false);

    const axiosInstance = useAxiosWithIntercepter();
  
    const navigate = useNavigate();
  
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('http://127.0.0.1:8000/farms/farmer');
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        //react-toasts should show messages
      } finally {
        setLoading(false);
      }
    };
  
    const deleteFarm = async (id: string) => {
      try {
        const response = await axiosInstance.delete(`http://127.0.0.1:8000/farms/${id}/`);
        console.log(response);
        if (response.status===202 || response.status===204){
          fetchData();
        }
      } catch (error) {
        //react-toasts should show messages
      }
      return 1;
    }
  
    const updateFarm = async (updatedRow: any) => {
      try {
        const response = await axiosInstance.put(
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
  
    const columns: GridColDef[] = [
      {
        field: 'farm_name',
        headerName: 'Farm Name',
        flex: 1,
        editable: true,
      },
      {
        field: 'farm_size',
        headerName: 'Farm Size',
        flex: 1,
        editable: true,
      },
      {
        field: 'farm_location',
        headerName: 'Farm Location',
        type: 'number',
        flex: 0.5,
        editable: true,
        //valueGetter: (params) => `$${params.value.toFixed(2)}`, // Format price as currency
      },
      {
        field: 'units',
        headerName: 'Unit types',
        flex: 0.5,
        editable: false,
        valueGetter: (value, row) => value.join(',')
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 1.5,
        editable: true
      },
      {
        field: 'product_categories',
        headerName: 'Categories',
        flex: 1,
        editable: false,
        valueGetter: (value, row) => value.join(',')
      },
      {
        field: 'products_count',
        headerName: 'Products',
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
            onClick={()=>deleteFarm(params.row.farm_id)}
          />,
          <GridActionsCellItem
            icon={<Pencil color='rgb(57, 57, 203)' />}
            label="edit"
            onClick={()=>navigate(`update-farm/${params.row.farm_id}`)}
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
      <div className='content-area-table m-auto p-16 w-full pb-2'>
          <div className='data-table-title w-full flex justify-between'>
              <h4 className='text-3xl font-semibold mb-6'>My Farms</h4>
              <button className='py-2 px-3 rounded-lg bg-blue-800 text-white h-fit' onClick={()=>navigate("create-farm")}>+Add Farm</button>
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
              processRowUpdate={updateFarm}
            />
          </Box>
      </div>
    )
}

export default MyFarms