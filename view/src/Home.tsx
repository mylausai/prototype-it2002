import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import { Container } from 'react-bootstrap';

function Home(props: any) {
  const [user, setUser] = useState({name: ''});
  useEffect(() => {
    const userString = localStorage.getItem('user'); // Retrieve user from local storage
    if (userString) {
      const user = JSON.parse(userString);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, []);

  return (
    <Container className="signed-in-container">
      <nav className="signed-in-nav"> 
        <ul>
          <li  className="selected-tab">
            <Link to={"/home/"+props.userType} className="no-cursor">Home</Link>
          </li>
          {props.userType === 'customer' && (
            <li>
              <Link to="/searchcar">Search Cars</Link>
            </li>
          )}
          {props.userType === 'owner' && (
            <li>
              <Link to="/postcar">Post Car</Link>
            </li>
          )}
          <li>
            <Link to={"/order/"+props.userType}>Order History</Link>
          </li>
          <li>
            <Link to="/">Sign out</Link>
          </li>
        </ul>
      </nav>
      <Container className="signed-in-text">
        <div className='welcome_text'>
          <h2>Home</h2>
          <p>Welcome, {user.name}!</p>
        </div>
      </Container>
    </Container>
  );
}

export default Home;