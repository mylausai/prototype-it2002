import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { getUsers } from './api'
import { Button } from "@chakra-ui/react"
import { HiMagnifyingGlass } from "react-icons/hi2";
import './home.css';

interface User {
  id: number;
  name: string;
  contact: string;
  email: string;
  total_cancelled: number;
  total_completed: number;
  total_earnings: number;
  total_cars: number;
}

function Home(props: any) {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const location = useLocation();
  const user = location.state;

  useEffect(() => {
    async function fetchUsers () {
      const user_type = props.userType;
      // fetch owner info from dashboard to display total earnings
      if (user_type==="owner") {
        const id = user.owner_id;
        const res = await getUsers(user_type, id) as User[];
        setUsers(res);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users && users.length > 0){
      const total = users[0].total_earnings
      setTotal(total)
    }
  }, [users]);

  return (
    <Container className="signed-in-container">
      <nav className={props.userType === 'customer' ? "signed-in-nav" : "owner-signed-in-nav"}> 
        <ul>
          <li className="selected-tab">
            <Link to={"/home/"+props.userType} state={user} className="no-cursor">Home</Link>
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
          <li>
            <Link to={"/order/"+props.userType} state={user}>Order History</Link>
          </li>
          <li>
            <Link to="/">Sign out</Link>
          </li>
        </ul>
      </nav>
      <Container className={props.userType === 'customer' ? "signed-in-text" : "owner-signed-in-text"}>
        <Container className={props.userType === 'customer' ? 'welcome_text' : "owner-welcome_text"}>
          <p>
            Welcome, {user.name}!
          </p>
        </Container>
        {props.userType === 'customer' && (
          <Container className='browseCarsButton'>
            <Link to="/searchcar" state={user}>
              <Button leftIcon={<HiMagnifyingGlass />} h="8vw" w="23vw">Browse Cars Now!</Button>
            </Link>
          </Container>
        )}
        {props.userType === 'owner' && (
          <>
        <Container className="divide_line"></Container>
        <Container className='earnings_text'>
          <p>Total Earnings:</p>
          <p className='earnings_number'> {total} </p>
        </Container></>)}
      </Container>
    </Container>
  );
}

export default Home;