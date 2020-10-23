import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import "./Navbar.css"

export default class Navbar extends Component {

    render() {
      return (
          <div className="container">
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/about" className="nav-link">About</NavLink>
            <NavLink to="/notify" className="nav-link">Notify Us</NavLink>
          </div>
      );
    }
  }