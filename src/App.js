import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import WishlistPage from "./pages/WishlistPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Checkout from "./pages/Checkout";

// Components
import Navbar from "./components/Navbar";

// Context
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on app start
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(!!loginStatus);
  }, []);

  // Load cart and wishlist from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCart(savedCart);
    const savedWishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    setWishlist(savedWishlist);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
  }, [wishlist]);

  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
          {/* ✅ FIXED: Only show Navbar on protected routes, not on login/signup */}
          {isLoggedIn && window.location.pathname !== "/login" && window.location.pathname !== "/signup" && (
            <Navbar 
              setIsLoggedIn={setIsLoggedIn}
              cartCount={cart.reduce((total, item) => total + item.quantity, 0)} 
              wishlistCount={wishlist.length} 
            />
          )}

          <Routes>
            {/* 🔓 Public Routes - NO NAVBAR HERE */}
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
            
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* 🔒 Protected Routes - NAVBAR SHOWS HERE */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home cart={cart} setCart={setCart} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart cart={cart} setCart={setCart} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout cart={cart} />
                </ProtectedRoute>
              }
            />
          </Routes>

          <ToastContainer position="top-right" autoClose={1500} />
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

export default App;