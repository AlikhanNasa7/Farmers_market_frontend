import React, { MouseEventHandler, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAxiosWithIntercepter from '../../helpers/jwtintercepters';

const orders: Array<Order> = [
    { id: '000000003', date: '10/11/19', shipTo: 'Veronica Costello', total: '$29.23', status: 'new' },
    { id: '000000002', date: '9/11/19', shipTo: 'Veronica Costello', total: '$39.64', status: 'in progress' },
    { id: '000000001', date: '9/11/19', shipTo: 'Veronica Costello', total: '$36.39', status: 'completed' },
];

const orderStatuses = [
    'new',
    'in progress',
    'completed'
]

type OrderStatus = "new" | "in progress" | "completed";

type Order = {
  id: string, 
  date: string,
  shipTo: string,
  total: string,
  status: OrderStatus
}

const Orders = () => {
    const [status, setStatus] = useState<string | null>();
    const [ordersData, setOrdersData] = useState<Array<Order>>([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const [role, setRole] = useState();

    const navigate = useNavigate();

    const axiosInstance = useAxiosWithIntercepter();


    useEffect(()=>{
      if (searchParams.get('status')){
        setStatus(searchParams.get('status'));
      }else{
        setStatus('');
      }
    }, [searchParams]);

    let filteredOrders = ordersData;

    if (status){
      filteredOrders = filteredOrders.filter(order=>order.status==status);
    }

    const handleStatusClick = (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      const newStatus = target.innerText;
      if (status!=newStatus){
        return navigate(`/orders?status=${newStatus}`);
      }else{
        return navigate(`/orders`);
      }
    }

    const fetchOrders = async () => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const user_role = user.role;
      setRole(user_role);
      if (user_role=='Buyer'){
        const response = await axiosInstance.get('http://127.0.0.1:8000/orders/get/');
        console.log(response.data);
        if (response.status==200){
          setOrdersData(response.data);
        }
      }else{
        const response = await axiosInstance.get('http://127.0.0.1:8000/orders/farm-orderitems/');
        console.log(response.data);
        if (response.status==200){
          setOrdersData(response.data);
        }
      }
    }

    useEffect(()=>{
      fetchOrders();
    },[]);
    

    return (
        <div className="container mx-auto mt-8">
          {ordersData.length>0 && (
            <>
              <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
              <div className='flex gap-4 mb-4'>
                {/* {orderStatuses.map(orderStatus=>(
                  <div onClick={handleStatusClick} className={`py-1 px-2 ${orderStatus==status ? "bg-blue-500 text-white" : "bg-white text-gray-500"} border w-fit rounded-2xl  text-sm hover:cursor-pointer`}>{orderStatus}</div>
                ))} */}
              </div>
              <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Order #</th>
                    {role=='Farmer' && <th className="border px-4 py-2">Product #</th>}
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Ship To</th>
                    <th className="border px-4 py-2">Order Total</th>
                    <th className="border px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersData.length>0 && ordersData.map((order) => (
                    <tr key={order.order_id} className='cursor-pointer hover:bg-blue-500 hover:text-white transition-colors' 
                    onClick={()=>{
                      if (role!="Farmer"){
                        return navigate(`/orders/${order.order_id}`)
                      }
                    }
                    }
                    >
                      <td className="border px-4 py-2 text-center">{role=='Farmer' ? order.order : order.order_id}</td>
                      {role=='Farmer' && <td className="px-4 py-2 flex items-center">
                        <Link to={`/products/${order.product}`}>
                          <img
                            src={order.product_image}
                            alt={order.product_name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          {order.product_name}
                        </Link>
                      </td>}
                      <td className="border px-4 py-2 text-center">{order.created_at.split('T')[0]}</td>
                      <td className="border px-4 py-2 text-center">{role=='Farmer' ? order.buyer : order.buyer_name}</td>
                      <td className="border px-4 py-2 text-center">{role=='Farmer' ? order.product_total_price : order.total_price}</td>
                      <td className="border px-4 py-2 text-center">{order.status}</td>
                    </tr>
                  ))}
                  {/* {filteredOrders.length==0 && <p>No order found with such status!</p>} */}
                </tbody>
              </table>
              <div className="mt-4">
                <span>{filteredOrders.length} Item(s)</span>
                <div className="float-right">
                  <label className="mr-2">Show</label>
                  <select className="border rounded px-2 py-1">
                    <option>10</option>
                    <option>20</option>
                    <option>50</option>
                  </select>
                  <span className="ml-2">per page</span>
                </div>
              </div>
            </>
            )
          }
        </div>
    );
}

export default Orders