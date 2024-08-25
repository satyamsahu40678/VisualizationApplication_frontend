// src/components/WelcomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f9;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
`;

const Button = styled(Link)`
  display: inline-block;
  margin: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

function WelcomePage() {
  return (
    <Container>
      <Title>Welcome to the E-Commerce Data Visualization</Title>
      <Button to="/sales-growth-rate">Sales Growth Rate</Button>
      <Button to="/sales-over-time">Sales Over Time</Button>
      <Button to="/geo-distribution">Geo Distribution</Button>
      <Button to="/new-customers">New Customers</Button>
      <Button to="/repeate-customers">Repeated Customers</Button>
      <Button to="/customer-lifetime-value">Customer Lifetime Value</Button>
    </Container>
  );
}

export default WelcomePage;
