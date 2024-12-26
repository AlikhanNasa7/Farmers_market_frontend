import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import useAxiosWithIntercepter from '../../helpers/jwtintercepters';
import { Dot } from 'lucide-react';

const ProductInformation = () => {
    const {productId} = useParams();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [product, setProduct] = useState();
    const [farm, setFarm] = useState();
    const [farmer, setFarmer] = useState();
    const axiosInstance = useAxiosWithIntercepter();

    const [quantity, setQuantity] = useState(0);

    const navigate = useNavigate();

    async function addToCart(){
      if (product.quantity<quantity){
        return
      }

      const response = await axiosInstance.post(`http://127.0.0.1:8000/carts/add-item/`, {
        product_id: productId,
        quantity: 1
      })
      setQuantity(prev=>prev+1);
      console.log(response.data);
    }


    useEffect(()=>{
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(`http://127.0.0.1:8000/products/${productId}/`);
          setProduct(response.data.product_details);
          setFarm(response.data.farm_details);
          setFarmer(response.data.farmer_details);
          setQuantity(response.data.quantity_in_cart);
          console.log(response.data);
        } catch (error) {
          //react-toasts should show messages
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }, [productId]);

    const handleChange = (event) => {
      const value = event.target.value;
      const num = parseInt(value, 10);
  
      if (value === '') {
        setQuantity(0);
      } else if (!isNaN(num) && num > 0) {
        setQuantity(num);
      }
    };

    return (
        <>
          {product && farm && farmer && (
          <>
            <div className="flex h-[80%] flex-col md:flex-row items-center justify-center bg-white p-6 space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-full md:w-1/2 flex justify-center overflow-hidden rounded-md">
                <img
                  src={`${product.image_urls[0]}`}
                  alt="Potato"
                  className="w-full max-w-lg hover:scale-125 transition-all"
                />
              </div>

              <div className="w-full md:w-1/2 flex flex-col gap-2 space-y-4 p-8">

                <div className="flex flex-col gap-4">
                  <p className="text-4xl font-semibold">
                    {product.name}
                  </p>
                  <p className="text-lg font-semibold text-gray-500">
                    {product.description}
                  </p>
                </div>

                {/* <div className="flex items-center space-x-2">
                  <div className="text-red-500 text-2xl">★★★★☆</div>
                  <span className="text-sm text-blue-500">(322 отзыва)</span>
                </div> */}

                <div className="text-4xl font-extrabold text-gray-800">
                  <div className='flex gap-2'>
                    <p className='text-green-600'>{product.price} ₸</p> 
                    {`/${product.unit_name.charAt(0).toUpperCase() + product.unit_name.slice(1)}`}
                  </div>
                </div>

                <div className="text-2xl font-extrabold text-gray-800">
                  {`${product.quantity} ${product.unit_name}`}
                </div>
                
                <div className='w-3/5 flex'>
                  {quantity==0 && <button onClick={addToCart} className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition">
                    Add to cart
                  </button>}
                  {quantity>0 && <button disabled={quantity>0} className={` text-white font-semibold py-2 px-4 rounded transition ${quantity>0 ? 'bg-gray-400': 'bg-red-500 hover:bg-red-600'}`}>
                    {`Already in cart (${quantity} ${product.unit_name})`}
                  </button>}
                </div>
          

                <ul className="text-sm text-gray-600 space-y-1">
                  <li>- Category: {product.category}</li>
                  <li>- Subcategory: {product.subcategory}</li>
                </ul>
              </div>
            </div>
            <div className="flex h-[80%] flex-col md:flex-row bg-white p-6 space-y-6 md:space-y-0 md:space-x-8">
              <div className='px-8'>
              <h2 className="text-2xl font-semibold my-8 mb-4">Farm Information</h2>
                    <div className='w-[90%] border border-gray-300 rounded-2xl background-white flex flex-col overflow-hidden justify-center items-center'>
                        <div className='flex relative w-full'>
                            <div className='w-3/5' onClick={()=>navigate(`/farmers/${farmer.user}`)}>
                              {farm.image_urls && <img src={farm.image_urls[0]} alt="" className='w-full h-full'/>}
                            </div>
                            <div className='w-2/5 p-4 flex flex-col gap-4'>
                              <h3 className='text-3xl font-bold'>Farmer Details</h3>
                              <hr />
                              <div className='w-full p-2 border border-gray-200 rounded-md'>
                                <div className='w-full p-2 border border-gray-200 rounded-md'>
                                  <img src={farmer.image} alt="" className='w-full h-full'/>
                                </div>
                                <p className='text-lg'>Full Name:  <span className='text-base'>{`${farmer.first_name} ${farmer.last_name}`}</span></p>
                                <p className='text-lg'>Registered:  <span className='text-base'>{farmer.created_at}</span></p>
                                <p className='text-lg'>Specialization:  <span className='text-base'>{farmer.specialization}</span></p>
                                <p className='text-lg'>Total Farm Area:  <span className='text-base'>{farmer.total_farm_area}</span></p>
                                <p className='text-lg'>Experience:  <span className='text-base'>{farmer.years_of_experience} years</span></p>
                              </div>
                            </div>
                        </div>
                        <div className='w-full border border-gray-300 rounded-b-lg overflow-hidden flex items-stretch'>
                            <div className='w-[60%] border-r-2 border-gray-300'>
                                <div className="py-4 px-4 w-full flex flex-col gap-2">
                                    <div className='flex justify-between items-center'>
                                      <p className="text-gray-700 text-3xl font-bold">{farm.farm_name}</p>
                                      <p className="text-gray-700 text-lg font-bold">. {farm.farm_location}</p>
                                    </div>
                                    <div className='flex text-sm font-bold text-gray-500 items-center'>
                                        <p className='text-lg'>{farm.description}</p>
                                    </div>
                                    <div className='flex -translate-x-2 text-lg font-bold text-gray-500 items-center'>
                                      <Dot/>
                                      Categories: {farm.product_categories.join(', ')}
                                    </div>
                                </div>
                            </div>
                            <div className='w-[40%] p-4 bg-white  text-lg flex flex-col justify-center'>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Size</span>
                                        <span className="text-orange-500 font-semibold">{farm.farm_size}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Rank</span>
                                        <span className="text-green-500 font-semibold">4.8</span>
                                    </div>
                            </div>
                        </div>
                    </div>
              </div>
            </div>
          </>)}

        </>
      );
}

export default ProductInformation