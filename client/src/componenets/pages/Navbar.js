import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import "./Navbar.css";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default class Navbar extends Component {

    render() {
      if (cookies.get("user_id") != null) {
      return (
          <div className="container">
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/results" className="nav-link">Results</NavLink>
            <NavLink to="/about" className="nav-link">About</NavLink>
            {/*<NavLink to="/notify" className="nav-link">Notify Us</NavLink>*/}
            {/*<NavLink to="/get_classes" className="nav-link">Get Classes</NavLink>*/}
            <NavLink to="/logout" className="nav-link">Logout</NavLink>
            <NavLink to="/compare" className="nav-link">Compare</NavLink>
          </div>
      );
    } else {
      return (
        <div className="container">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/about" className="nav-link">About</NavLink>
          {/*<NavLink to="/notify" className="nav-link">Notify Us</NavLink>*/}
          {/*<NavLink to="/get_classes" className="nav-link">Get Classes</NavLink>*/}
        </div>
    );
    }
    
  }
}{}