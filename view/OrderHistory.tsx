import { useEffect, useState } from 'react';
import { getOrders } from './api';
import { Link } from 'react-router-dom';

function OrderHistory(props) {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

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
        console.log('fetchorder:', id)
        const userType = props.userType;
        const orders = await getOrders({id, userType});
        setOrders(orders);
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
            {orders.map((order) => (
              <tr key={order.id}>
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
