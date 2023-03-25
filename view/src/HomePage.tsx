import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Button } from "@chakra-ui/react";
import { AiFillCar } from "react-icons/ai";
import { TbMan } from "react-icons/tb";

import './index.css'


function HomePage() {
  return (
    <Container className="home-container">
      <div className="home-box">
      <Row>
        <Col>
          <h1 className="home-title">Welcome to Car Rental</h1>
          <p className="home-subtitle">Are you a customer or an owner?</p>
        </Col>
      </Row>
      <Row style={{ display: "flex", justifyContent: "space-between" }}>
        <Col xs={6} md={3}>
          <Link to="/login/customer">
            <Button leftIcon={<TbMan />} colorScheme='blue' size="lg" mr={5} minW="calc(20vw)" minH="calc(10vw)" fontSize={"2.5vw"}>Customer</Button>
          </Link>
        </Col>
        <Col xs={6} md={3}>
          <Link to="/login/owner">
            <Button leftIcon={<AiFillCar />} colorScheme="blue" size="lg" mr={2} minW="calc(20vw)" minH="calc(10vw)" fontSize={"2.5vw"}>Owner</Button>
          </Link>
        </Col>
      </Row>
      </div>
    </Container>
  );
}

export default HomePage;
