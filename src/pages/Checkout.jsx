import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [address, setAddress] = useState({
    fullName: '',
    addressLine: '',
    city: '',
    pincode: '',
    phone: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);

  // ✅ Format price to 2 decimal places
  const formatPrice = (price) => {
    return Number(price).toFixed(2);
  };

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
    
    setTimeout(() => {
      navigate('/home');
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <div className="container mt-5 text-center">
        <div className="card p-5 shadow-lg border-0 rounded-4" style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" }}>
          <h2 className="display-4 mb-4">🎉 Order Placed Successfully!</h2>
          <p className="fs-4">Thank you for shopping with DheeKart</p>
          <div className="spinner-border text-primary mt-4" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 display-5 fw-bold">Checkout</h2>
      
      <div className="row">
        {/* Shipping Address Form */}
        <div className="col-md-7">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <h4 className="mb-4">Shipping Address</h4>
            <form onSubmit={handlePlaceOrder}>
              <div className="mb-3">
                <label className="form-label fw-bold">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control form-control-lg"
                  required
                  value={address.fullName}
                  onChange={handleAddressChange}
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Address Line</label>
                <input
                  type="text"
                  name="addressLine"
                  className="form-control form-control-lg"
                  required
                  value={address.addressLine}
                  onChange={handleAddressChange}
                />
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control form-control-lg"
                    required
                    value={address.city}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    className="form-control form-control-lg"
                    required
                    value={address.pincode}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-bold">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control form-control-lg"
                  required
                  value={address.phone}
                  onChange={handleAddressChange}
                />
              </div>
              
              <h4 className="mb-3">Payment Method</h4>
              
              <div className="mb-4">
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label fs-5">
                    💵 Cash on Delivery
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label fs-5">
                    💳 Credit/Debit Card (Demo)
                  </label>
                </div>
              </div>
              
              <button type="submit" className="btn btn-success btn-lg w-100">
                Place Order • €{formatPrice(totalPrice)}
              </button>
            </form>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="col-md-5">
          <div className="card shadow-lg border-0 rounded-4 p-4" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <h4 className="mb-4">Order Summary</h4>
            <hr className="bg-white" />
            
            {cartItems.map(item => (
              <div key={item.id} className="d-flex justify-content-between mb-2">
                <span>{item.title.substring(0, 20)}... x{item.quantity}</span>
                <span className="fw-bold">€{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            
            <hr className="bg-white" />
            
            <div className="d-flex justify-content-between fw-bold fs-3">
              <span>Total</span>
              <span>€{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;