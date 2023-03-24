import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

function Home(props) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userString = localStorage.getItem('user'); // Retrieve user from local storage
    if (userString) {
      const user = JSON.parse(userString);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, []);

  return (
    <div>
      <nav> 
        <ul>
          <li>
            <Link to="/">Sign out</Link>
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
        </ul>
      </nav>
      <div style={{ textAlign: 'center' }}>
      <h2>Home</h2>
      <p>Welcome, {user ? user.name : 'Guest'}!</p>
      </div>
    </div>
  );
}

export default Home;