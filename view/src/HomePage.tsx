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
        </Col>
      </Row>
      <Row style={{ display: "flex", justifyContent: "space-between" }}>
        <Col xs={6} md={3}>
          <Link to="/login/customer">
            <Button leftIcon={<TbMan />} color="#ffffff" backgroundColor={"#174b4d"} _hover={{bg: '#F5DEB3', color: '#000000'}} size="lg" mr={5} minW="calc(20vw)" minH="calc(10vw)" fontSize={"2.5vw"}>Customer</Button>
          </Link>
        </Col>
        <Col xs={6} md={3}>
          <Link to="/login/owner">
            <Button leftIcon={<AiFillCar />} color="#ffffff" backgroundColor={"#174b4d"} _hover={{bg: '#F5DEB3', color: '#000000'}} size="lg" mr={2} minW="calc(20vw)" minH="calc(10vw)" fontSize={"2.5vw"}>Owner</Button>
          </Link>
        </Col>
      </Row>
      </div>
    </Container>
  );
}

export default HomePage;
