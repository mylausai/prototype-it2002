import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './index.css';

function HomePage() {
  return (
    <Container className="home-container">
      <Row>
        <Col>
          <h1 className="home-title">Welcome to Car Rental</h1>
          <p className="home-subtitle">Are you a customer or an owner?</p>
        </Col>
      </Row>
      <Row>
        <Col xs={6} md={3} className="home-btn-col">
          <Link to="/login/customer">
            <Button variant="primary" className="home-btn">Customer Login</Button>
          </Link>
        </Col>
        <Col xs={6} md={3} className="home-btn-col">
          <Link to="/login/owner">
            <Button variant="secondary" className="home-btn">Owner Login</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
