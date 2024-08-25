// src/components/Navbar.js
import React from 'react';
import styled from 'styled-components';

// Define styled components
const NavbarContainer = styled.nav`
  background-color: #333; /* Example background color */
  color: #fff; /* Text color */
  padding: 1rem; /* Padding around the navbar */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Example shadow */
`;

const NavbarTitle = styled.h1`
  margin: 0; /* Remove default margin */
  font-size: 1.5rem; /* Font size */
  text-align: center; /* Center text */
`;

function Navbar() {
    return (
        <NavbarContainer>
            <NavbarTitle>E-commerce Data Visualization</NavbarTitle>
        </NavbarContainer>
    );
}

export default Navbar;
