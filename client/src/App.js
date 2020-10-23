import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom"; 
import Cookies from 'universal-cookie';

/* Componenets for each page + navbar */
import Navbar from "./componenets/pages/Navbar";
import Home from "./componenets/pages/Home";
import About from "./componenets/pages/About"
import Results from "./componenets/pages/Results"
import Login from "./componenets/pages/Login"

// cookie functionality 
const cookies = new Cookies();



function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Route path="/" exact component={Login} className="Route"/> 
        <Route path="/home" component={Home} className="Route" />
        <Route path="/about" component={About} className="Route"/> 
        <Route path="/results" component={Results} className="Route"/> 
        
      </Router>

     
    </div>
  );
}

export default App;
