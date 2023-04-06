import { useEffect, useState } from 'react';
import { getOrders, updateOrder } from './api';
import { Link, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './home.css';

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
  const location = useLocation();
  const user = location.state;

  useEffect(() => {
    async function fetchOrders() {
      if (user.customer_id || user.owner_id) { // only fetch order history with id present
        const user_id = props.userType === 'customer' ? user.customer_id : user.owner_id;
        const user_type = props.userType;
        const status = activeTab;
        const orders = await getOrders(user_id, user_type, status) as Record<string, Order>;
        setOrders(Object.values(orders));
      }
    }
    fetchOrders();
  }, [user, activeTab]); // update based on status

  function handleCancel(order: Order) {
    const isConfirmed = window.confirm("Are you sure you want to cancel?");
    if (isConfirmed) {
      order.status = 'cancelled';
      reviseOrder(order);
      window.alert(`Order cancelled.`)
    }
  }

  function handleConfirm(order: Order) {
    const isConfirmed = window.confirm("Are you sure you want to confirm?");
    if (isConfirmed) {
      order.status = 'confirmed';
      reviseOrder(order);
      window.alert(`Order confirmed.`)
    }
  }

  function handleComplete(order: Order) {
    const isConfirmed = window.confirm("Complete your order?");
    if (isConfirmed) {
      order.status = 'completed';
      reviseOrder(order);
      window.alert(`Order completed.`)
    }
  }

  async function reviseOrder(order: Order) {
    const updatedOrders = orders.map(o => o.rental_id === order.rental_id ? order : o);
    setOrders(updatedOrders);
    const rental_id = order.rental_id;
    const status = order.status;
    updateOrder(rental_id, status); // api function
    window.location.reload();
  }

  const tabNames = ['pending', 'confirmed', 'cancelled', 'completed'];

  const TabButton = (props: { status: string, label: string, className: string}) => {
    const { status, label, className } = props;
    const handleClick = () => setActiveTab(status);
    const isActive = activeTab === status;
    return (
      <button onClick={handleClick} className={`${isActive ? 'active' : ''} ${className || ''}`}>{label}</button>
    );
  };

  return (
    <Container className="signed-in-container">
      <nav className={props.userType === 'customer' ? "signed-in-nav" : "owner-signed-in-nav"}>
        <ul>
          <li>
            <Link to={"/home/"+props.userType} state={user}>Home</Link>
          </li>
          {props.userType === 'customer' && (
          <li>
            <Link to="/searchcar" state={user}>Search Cars</Link>
          </li>
          )}
          {props.userType === 'owner' && (
          <li>
            <Link to="/postcar" state={user}>Post Car</Link>
          </li>
          )}
          <li className="selected-tab">
            <Link to="/order/customer" state={user} className="no-cursor">Order History</Link>
          </li>
          <li>
            <Link to="/">Sign out</Link>
          </li>
        </ul>
      </nav> 
      <Container className={props.userType === 'customer' ? "orderHistoryMain" : "owner-orderHistoryMain"}>
        <h2 className='orderHistoryTitle'>Order History</h2>
        <div>
          {tabNames.map((status) => (
            <TabButton key={status} status={status} label={status.charAt(0).toUpperCase() + status.slice(1)} className={props.userType === 'customer' ? "tab-button" : "owner-tab-button"}/>
          ))}
        </div>
        <table className={props.userType === 'customer' ? "" : "owner-orderHistTable"}>
          <thead className='orderHist-db-columns'>
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
              {activeTab === 'pending' || activeTab === 'confirmed' ? (
              <th>Actions</th>):''}
            </tr>
          </thead>
          <tbody className='orderHist-db-rows'>
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
                {activeTab === 'pending' || activeTab === 'confirmed' ? (
                <td className='actionButtons'>
                  {activeTab === 'pending' && (
                  <>
                    {props.userType === 'customer' ? (
                      <button className='cancelButton' onClick={() => handleCancel(order)}>Cancel</button>
                    ) : (
                      <><button className='confirmButton' onClick={() => handleConfirm(order)}>Confirm</button>
                      <button className='cancelButton' onClick={() => handleCancel(order)}>Cancel</button></>
                    )} 
                  </>  
                  )}
                  {activeTab === 'confirmed' && (
                    <button className='completeButton' onClick={() => handleComplete(order)}>Complete</button>
                  )}
                </td>) :''}
              </tr>
            ))}
          </tbody>
        </table>
        </Container>
    </Container>
  );               
};

export default OrderHistory;