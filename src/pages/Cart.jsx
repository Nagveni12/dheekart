import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Cart({ cart, setCart }) {
  const navigate = useNavigate();
  const [productStocks, setProductStocks] = useState({});

  // ✅ Helper: Format price to 2 decimal places
  const formatPrice = (price) => {
    return Number(price).toFixed(2);
  };

  // Load cart from localStorage & calculate available stocks
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCart(savedCart);

    const stocks = {};
    savedCart.forEach(item => {
      const savedStock = localStorage.getItem(`stock_${item.id}`);
      if (savedStock) stocks[item.id] = parseInt(savedStock);
    });
    setProductStocks(stocks);
  }, [setCart]);

  // Update localStorage whenever cart changes
  const updateLocalStorage = (updatedCart) => {
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  // Increase Quantity - Check stock limit
  const increaseQty = (index) => {
    const updatedCart = [...cart];
    const item = updatedCart[index];
    const currentStock = productStocks[item.id] || 10; // fallback

    if (item.quantity < currentStock) {
      updatedCart[index].quantity += 1;
      updateLocalStorage(updatedCart);
    } else {
      toast.warning(`Only ${currentStock} items available in stock!`);
    }
  };

  // Decrease Quantity
  const decreaseQty = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      updateLocalStorage(updatedCart);
    } else {
      handleRemove(index);
    }
  };

  // Remove item from cart
  const handleRemove = (indexToRemove) => {
    const updatedCart = cart.filter((_, index) => index !== indexToRemove);
    updateLocalStorage(updatedCart);
    toast.info("Item removed from cart");
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cartItems");
    toast.warn("Cart cleared!");
  };

  // When cart is empty
  if (cart.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <div className="card p-5 shadow">
          <h2 className="mb-4">Your Cart is Empty 🛒</h2>
          <p className="fs-5">Add items from the Home page.</p>
          <button 
            className="btn btn-primary btn-lg mt-3 mx-auto w-25"
            onClick={() => navigate('/home')}
          >
            Go Shopping
          </button>
        </div>
      </div>
    );
  }

  // Calculate total price
  const totalPrice = cart
    .reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center display-5 fw-bold">Your Shopping Cart 🛒</h1>
      
      {/* Clear Cart Button */}
      <div className="text-end mb-3">
        <button className="btn btn-danger btn-lg" onClick={clearCart}>
          🗑️ Clear Cart
        </button>
      </div>
      
      <div className="row">
        {/* Cart Items */}
        <div className="col-md-8">
          {cart.map((item, index) => (
            <div key={index} className="card mb-4 shadow-lg border-0 rounded-4">
              <div className="row g-0 p-3">
                {/* Product Image */}
                <div className="col-md-3 d-flex align-items-center">
                  <img 
                    src={item.image || item.images?.[0] || "https://via.placeholder.com/150"} 
                    alt={item.title}
                    className="img-fluid rounded-3"
                    style={{ maxHeight: "120px", objectFit: "contain" }}
                  />
                </div>

                {/* Product Details */}
                <div className="col-md-6">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{item.title}</h5>
                    <p className="card-text text-success fs-4 fw-bold">
                      ₹{formatPrice(item.price)}
                    </p>
                    <p className="text-muted">
                      Stock available: {productStocks[item.id] || 'Loading...'}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="col-md-3 d-flex align-items-center justify-content-end">
                  <div className="d-flex align-items-center gap-3">
                    <button 
                      className="btn btn-outline-primary rounded-circle fw-bold" 
                      style={{ width: "40px", height: "40px" }}
                      onClick={() => decreaseQty(index)}
                    >
                      -
                    </button>
                    <span className="fs-4 fw-bold mx-2">{item.quantity}</span>
                    <button 
                      className="btn btn-outline-primary rounded-circle fw-bold" 
                      style={{ width: "40px", height: "40px" }}
                      onClick={() => increaseQty(index)}
                    >
                      +
                    </button>
                    <button 
                      className="btn btn-outline-danger ms-3"
                      onClick={() => handleRemove(index)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
              {/* Item Total Price */}
              <div className="text-end pe-3 pb-2">
                <span className="fw-bold">₹{formatPrice(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="col-md-4">
          <div className="card shadow-lg border-0 rounded-4 p-4" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <h3 className="fw-bold mb-4">Order Summary</h3>
            <hr className="bg-white" />

            {cart.map((item, index) => (
              <div key={index} className="d-flex justify-content-between mb-2">
                <span>{item.title.substring(0, 15)}... x{item.quantity}</span>
                <span className="fw-bold">₹{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}

            <hr className="bg-white" />

            <div className="d-flex justify-content-between mb-4">
              <span className="fs-4">Total:</span>
              <span className="fs-3 fw-bold">₹{formatPrice(totalPrice)}</span>
            </div>

            <button 
              className="btn btn-warning btn-lg fw-bold w-100"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
