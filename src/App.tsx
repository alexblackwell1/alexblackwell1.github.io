<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Wishlists from "./pages/Wishlists";
import WishlistDetails from "./pages/WishlistDetails";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/wishlists" element={<Wishlists />} />
          <Route path="/wishlists/:id" element={<WishlistDetails />} />
        </Routes>
      </Router>
    </AuthProvider>
=======
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
>>>>>>> parent of 9bc27ca (ADD: home and about page)
  );
}

export default App;
