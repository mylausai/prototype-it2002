import React, { useState } from 'react';
import { createUser } from './api';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

function CreateAccountPage(props: any) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log(name, contact, email, password, props.userType);
    const success = await createUser({name, contact, email, password}, props.userType);
    if (success) {
      navigate('/'); // LoginPage
    }
  };

  return (
    <div className="bg-dark">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">Home</Link>
        </div>
      </nav>
      <div className="container mt-5">
        <h1>Create an Account</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicName">
            <Form.Label>Name:</Form.Label>
            <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="formBasicContact">
            <Form.Label>Contact:</Form.Label>
            <Form.Control type="text" placeholder="Enter contact" value={contact} onChange={(e) => setContact(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address:</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
            <Button variant="primary" type="submit">Create Account</Button>
        </Form>
      </div>
    </div>
  );
}

export default CreateAccountPage;
