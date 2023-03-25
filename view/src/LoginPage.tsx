import React, { useState } from 'react';
import { login } from './api';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Container } from 'react-bootstrap';
import { Button } from "@chakra-ui/react";
import { createUser } from './api';

function LoginPage(props: any) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const user = await login(email, password, props.userType);
    setUser(user);
    // handle the response, for example by redirecting the user to another page
    if (user) {             
      localStorage.setItem('user', JSON.stringify(user));
      navigate("/home/"+props.userType);
    } 
  } 

  const handleCreateAccountSubmit = async (event: any) => {
    event.preventDefault();
    const success = await createUser({email, password}, props.userType);
    if (success) {
      const user = await login(email, password, props.userType);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        navigate("/home/"+props.userType);
      } 
    }
  }

  return (
    <Container className="home-container">
      <div className="logincreatehome-box">
        <h1 style={{fontSize:'1.5vw',marginBottom:'0.5vw'}}>Customer Login</h1>
        <div className='homeButton'>
          <Button fontSize="1.2vw"><Link to="/" className="backHome">Back to home</Link></Button>
        </div>
        <div className="logincreate-box">
          <div className='login-box'>
          <h1 style={{fontSize: '1.5vw'}}><strong>Log In</strong></h1>
            <div className="login-area">
              <Form onSubmit={handleSubmit}>
                <div className='email-pass'>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address:</Form.Label>
                    <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className='formGroups'/>
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className='formGroups'/>
                  </Form.Group>
                  <p></p>
                </div>
                <Button color="#ffffff" backgroundColor={"#174b4d"} _hover={{bg: '#F5DEB3', color: '#000000'}} size="lg" type="submit" fontSize="1.2vw">
                  Log In
                </Button>
              </Form>
            </div>
          </div>

          <div className='create-box'>
            <h1 style={{fontSize: '1.5vw'}}><strong>Create Account</strong></h1>
            <div className="login-area">
              <Form onSubmit={handleSubmit}>
                <div className='email-pass'>
                <Form.Group controlId="formBasicName">
                  <Form.Label>Name:</Form.Label>
                  <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}  className='formGroups'/>
                </Form.Group>

                <Form.Group controlId="formBasicContact">
                  <Form.Label>Contact:</Form.Label>
                  <Form.Control type="text" placeholder="Enter contact" value={contact} onChange={(e) => setContact(e.target.value)} className='formGroups'/>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address:</Form.Label>
                  <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className='formGroups'/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className='formGroups'/>
                </Form.Group>
                </div>
                <Button color="#ffffff" backgroundColor={"#174b4d"} _hover={{bg: '#F5DEB3', color: '#000000'}} size="lg" type="submit" fontSize="1.2vw">Create Account</Button>
              </Form>
            </div>
          </div>
        </div>
        
      </div>
    </Container>
  );
}
// Original link to create account page
// <p className="mt-3 text-center">Don't have an account? <Link to={"/create/"+props.userType}>Create</Link></p> 
export default LoginPage;