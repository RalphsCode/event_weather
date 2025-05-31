/**
 * NavBar to go on all pages
 */

import React from 'react';
import './NavBar.css'; // Assuming you have a CSS file for styling

function NavBar() {
  return (
    <nav style={{
      backgroundColor: '#333',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    }}>
      <ul style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
      }}>
        <li style={{ marginRight: '20px' }}>
          <a href="/" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.1em',
            fontWeight: 'bold',
          }}>
            Home
          </a>
        </li>
        <li style={{ marginRight: '20px' }}>
          <a href="/about" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.1em',
            fontWeight: 'bold',
          }}>
            Log In
          </a>
        </li>
        <li>
          <a href="/contact" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.1em',
            fontWeight: 'bold',
          }}>
            Register
          </a>
        </li>
        <li>
          <a href="/contact" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.1em',
            fontWeight: 'bold',
          }}>
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;