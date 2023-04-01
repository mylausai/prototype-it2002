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
          <Col>
            <Link to="/login/customer">
              <Button leftIcon={<TbMan />} color="#ffffff" backgroundColor={"#174b4d"} _hover={{bg: '#F5DEB3', color: '#000000'}} h="8vw" w="23vw" mr="1.2vw" fontSize={"3vw"}>Customer</Button>
            </Link>
          </Col>
          <Col>
            <Link to="/login/owner">
              <Button leftIcon={<AiFillCar />} color="#ffffff" backgroundColor={"#174b4d"} _hover={{bg: '#F5DEB3', color: '#000000'}} h="8vw" w="23vw" fontSize={"3.3vw"}>Owner</Button>
            </Link>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default HomePage;
