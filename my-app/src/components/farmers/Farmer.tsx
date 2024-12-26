import React, {useContext, useEffect, useState} from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { FarmerData } from './types';
import { Dot } from 'lucide-react';
import profile_photo from './profile_photo.jpg';
import { Phone } from 'lucide-react';
import { Inbox } from 'lucide-react';
import farm_photo from './farm.jpg';

import { FarmerContext, FarmerContextProvider } from './FarmerContext';
import FarmerInformation from './FarmerInformation';
import FarmerProducts from './FarmerProducts';
import useAxiosWithIntercepter from '../../helpers/jwtintercepters';

// const FARMER_DATA: Array<FarmerData> = [
//     {
//       "id": 1,
//       "name": "Beket Farhatovich",
//       "location": "Almaty, Emendik",
//       "farmSize": "100 acres",
//       "crops": ["Corn", "Wheat", "Soybeans"],
//       "contact": {
//         "phone": "+1-555-123-4567",
//         "email": "johndoe@example.com"
//       },
//       "imageUrl": "https://example.com/farmers/johndoe.jpg",
//       "description": "Beket has been farming for over 15 years, specializing in sustainable agricultural practices."
//     },
//     {
//       "id": 2,
//       "name": "Maria Lyublyna",
//       "location": "Shymkent, Arys",
//       "farmSize": "75 acres",
//       "crops": ["Avocados", "Oranges", "Grapes"],
//       "contact": {
//         "phone": "+1-555-987-6543",
//         "email": "maria@example.com"
//       },
//       "imageUrl": "https://example.com/farmers/mariagarcia.jpg",
//       "description": "Maria runs an organic farm and supplies local markets with fresh, high-quality produce."
//     },
//     {
//       "id": 3,
//       "name": "Liam Dalban",
//       "location": "Astana, Esil",
//       "farmSize": "200 acres",
//       "crops": ["Corn", "Soybeans"],
//       "contact": {
//         "phone": "+1-555-234-5678",
//         "email": "liamsmith@example.com"
//       },
//       "imageUrl": "https://example.com/farmers/liamsmith.jpg",
//       "description": "Liam focuses on modern, data-driven farming techniques to maximize crop yields."
//     },
//     {
//       "id": 4,
//       "name": "Nashtay Alikhan",
//       "location": "Almaty, Bostandyk",
//       "farmSize": "200 acres",
//       "crops": ["Corn", "Soybeans"],
//       "contact": {
//         "phone": "+1-555-234-5678",
//         "email": "liamsmith@example.com"
//       },
//       "imageUrl": "https://example.com/farmers/liamsmith.jpg",
//       "description": "Liam focuses on modern, data-driven farming techniques to maximize crop yields."
//     },
//     {
//       "id": 5,
//       "name": "Bolat Labakbay",
//       "location": "Almaty, Ile",
//       "farmSize": "200 acres",
//       "crops": ["Corn", "Soybeans"],
//       "contact": {
//         "phone": "+1-555-234-5678",
//         "email": "liamsmith@example.com"
//       },
//       "imageUrl": "https://example.com/farmers/liamsmith.jpg",
//       "description": "Liam focuses on modern, data-driven farming techniques to maximize crop yields."
//     }
// ]

const Farmer = () => {
    const {farmerId} = useParams();

    const axiosInstance = useAxiosWithIntercepter();

    const [farmerData, setFarmerData] = useState();
    const [lastProducts, setLastProducts] = useState();
    const [farms, setFarms] = useState();

    const farmerContext = useContext(FarmerContext);
    const [loading, setLoading] = useState(false);
    // if (!farmerContext){
    //   throw new Error("Farmer component must be used within FarmerContextProvider");
    // }

    //const { farmerData, setFarmerData } = farmerContext;

    useEffect(()=>{
      const fetchFarmer = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(`http://127.0.0.1:8000/user/farmers/${farmerId}/`);
          setLastProducts(response.data.last_products);
          setFarms(response.data.farms);
          setFarmerData(response.data.farmer_details)
          console.log(response.data);
          setLoading(false);
        } catch (error) {
          //react-toasts should show messages
        } finally {
          setLoading(false);
        }
      };
      fetchFarmer();
    }, [farmerId]);

    return (
        <div className='w-full flex flex-col gap-8'>
          {farmerData && <FarmerInformation farmer={farmerData} farms={farms}/>}
          {/* <FarmerProducts/> */}
        </div>
    )
}

export default Farmer