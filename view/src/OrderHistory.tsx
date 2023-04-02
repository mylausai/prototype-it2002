/*
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

  const [orders, setOrders] = useState<Order[]>([]);
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
       if (user.customer_id || user.owner_id) { // only fetch order history with id present
        const user_id = props.userType === 'customer' ? user.customer_id : user.owner_id;
        console.log('getorder userid: ', user_id)
        const user_type = props.userType;
        console.log('getorder: ', user_type)
        const orders = await getOrders(user_id, user_type) as Record<string, Order>;
        setOrders(Object.values(orders));
       } 
    }
    fetchOrders();
  }, [user]); // check again

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
*/

import { useEffect, useState } from 'react';
import { getOrders, updateOrder } from './api';
import { Link } from 'react-router-dom';

interface Order {
  rental_id: number;
  make_model: string;
  pickup_location: string;
  rental_days: number;
  total_cost: number;
  contact: string;
  status: string;
}

function OrderHistory(props: any) {

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
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
      if (user.customer_id || user.owner_id) { // only fetch order history with id present
        const user_id = props.userType === 'customer' ? user.customer_id : user.owner_id;
        const user_type = props.userType;
        const orders = await getOrders(user_id, user_type) as Record<string, Order>;
        console.log('fetchedorders: ', orders)
        setOrders(Object.values(orders));
      }
    }
    fetchOrders();
  }, [user]);

  function handleCancel(order: Order) {
    order.status = 'cancelled';
    reviseOrder(order);
  }

  function handleConfirm(order: Order) {
    order.status = 'confirmed';
    reviseOrder(order);
  }

  function handleComplete(order: Order) {
    order.status = 'completed';
    reviseOrder(order);
  }

  async function reviseOrder(order: Order) {
    const updatedOrders = orders.map(o => o.rental_id === order.rental_id ? order : o);
    setOrders(updatedOrders);
    const rental_id = order.rental_id;
    const status = order.status;
    updateOrder(rental_id, status);
    // TODO: Update order status on server using API call
  }

  const filterOrdersByStatus = (status: string) => {
    return orders.filter((order) => order.status === status);
  };

  const tabNames = ['pending', 'confirmed', 'cancelled', 'completed'];

  const TabButton = (props: { status: string, label: string }) => {
    const { status, label } = props;
    const handleClick = () => setActiveTab(status);
    const isActive = activeTab === status;
    return (
      <button onClick={handleClick} className={isActive ? 'active' : ''}>{label}</button>
    );
  };

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
      <div>
        {tabNames.map((status) => (
          <TabButton key={status} status={status} label={status.charAt(0).toUpperCase() + status.slice(1)} />
        ))}
      </div>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterOrdersByStatus(activeTab).map((order, index) => (
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
              <td>
                {activeTab === 'pending' && (
                <>
                  {props.userType === 'customer' ? (
                    <button onClick={() => handleCancel(order)}>Cancel</button>
                  ) : (
                    <><button onClick={() => handleCancel(order)}>Cancel</button>
                    <button onClick={() => handleConfirm(order)}>Confirm</button></>
                  )} 
                </>  
                )}
                {activeTab === 'confirmed' && (
                  <button onClick={() => handleComplete(order)}>Complete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );               
};

export default OrderHistory;