import { useEffect, useState } from 'react';
import { getOrders } from './api';
import { Link } from 'react-router-dom';

interface Order {
  make_model: string;
  pickup_location: string;
  rental_days: number;
  total_cost: number;
  contact: string;
}

function OrderHistory(props: any) {

  const [orders, setOrders] = useState<Order[]>([{make_model:'', pickup_location:'', rental_days:0, total_cost:0, contact:''}]);
  const [user, setUser] = useState({customer_id:'', owner_id:''});

  useEffect(() => {
    const userString = localStorage.getItem('user'); // Retrieve user from local storage
    if (userString) {
      const user = JSON.parse(userString);
      setUser(user);
    }
  }, []);

  useEffect(() => {
    async function fetchOrders() {
       if (user) {
        const id = props.userType === 'customer' ? user.customer_id : user.owner_id;
        const userType = props.userType;
        const orders = await getOrders({id, userType});
        const newOrder: Order = {make_model: '', pickup_location: '', rental_days: 0, total_cost: 0, contact: ''};
        setOrders((orders: Order[]) =>[...orders, newOrder]);
       } 
    }
    fetchOrders();
  }, [props.userType, user]);

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Sign out</Link>
          </li>
          <li>
            <Link to={"/home/"+props.userType}>Home</Link>
          </li>
        </ul>
      </nav>  
      <h2>Order History</h2>
      {orders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Make/Model</th>
              <th>Pickup Location</th>
              <th>Rental Days</th>
              <th>Total Cost</th>
              {props.userType === 'customer' ? (
                <th>Owner's Contact</th>
              ) : (
                <th>Customer's Contact</th>
              )}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.make_model}</td>
                <td>{order.pickup_location}</td>
                <td>{order.rental_days}</td>
                <td>{order.total_cost}</td>
                {props.userType === 'customer' ? (
                  <td>{order.contact}</td>
                ) : (
                  <td>{order.contact}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default OrderHistory;
