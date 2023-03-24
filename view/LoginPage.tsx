import React, { useState } from 'react';
import { login } from './api';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

function LoginPage(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = await login(email, password, props.userType);
    setUser(user);
    // handle the response, for example by redirecting the user to another page
    if (user) {             
      localStorage.setItem('user', JSON.stringify(user));
      navigate("/home/"+props.userType);
    } 
  } 

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
        </ul>
      </nav>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div>
          <h1 className="text-center mb-5">Log In</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <p></p>
            <Button variant="primary" type="submit" className="mt-3">
              Log In
            </Button>
          </Form>
          <p className="mt-3 text-center">Don't have an account? <Link to={"/create/"+props.userType}>Create</Link></p>
        </div>
      </Container>
    </div>
  );
}

export default LoginPage;