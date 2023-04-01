import React, { useState } from 'react';
import { login } from './api';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Container } from 'react-bootstrap';
import { Button } from "@chakra-ui/react";
import { createUser } from './api';
import { AiFillCar, AiFillHome } from "react-icons/ai";
import { TbMan } from "react-icons/tb";
import { Icon } from '@chakra-ui/react'

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
    <Container className="login-container">
      <div className='homeButton'>
          <Button leftIcon={<AiFillHome/>} w="15vw" h="3.3vw" fontSize="1.3vw"><Link to="/" className="backHome">Back to Home</Link></Button>
      </div>
      <div className="logintext">
          <h1 style={{fontSize:'3vw'}}>
            {props.userType === "customer" ? (
              <Icon as={TbMan} />
            ) : (
              <Icon as={AiFillCar} />
            )}
            {props.userType === "customer" ? " Customer Login" : " Car Owner Login"}
          </h1>
      </div>
      <div className="logincreatehome-box">
        <div className="logincreate-box">
          <div className='login-box'>
            <h1 style={{fontSize: '1.5vw'}}>Log In</h1>
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
                <Button color="#ffffff" backgroundColor={"#174b4d"} _hover={{bg: '#F5DEB3', color: '#000000'}} height="4vw" width="9vw" type="submit" fontSize="1.5vw">
                  Log In
                </Button>
              </Form>
            </div>
          </div>

          <div className='create-box'>
            <h1 style={{fontSize: '1.5vw'}}>Create Account</h1>
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

                <Form.Group controlId="formBasicEmailc">
                  <Form.Label>Email address:</Form.Label>
                  <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className='formGroups'/>
                </Form.Group>

                <Form.Group controlId="formBasicPasswordc">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className='formGroups'/>
                </Form.Group>
                </div>
                <Button color="#ffffff" backgroundColor={"#174b4d"} _hover={{bg: '#F5DEB3', color: '#000000'}} height="4vw" width="12vw" type="submit" fontSize="1.5vw">Create Account</Button>
              </Form>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center">Don't have an account? <Link to={"/create/"+props.userType}>Create</Link></p> 
      </div>
    </Container>
  );
}
// Original link to create account page
// <p className="mt-3 text-center">Don't have an account? <Link to={"/create/"+props.userType}>Create</Link></p> 
export default LoginPage;