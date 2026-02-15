import React, { useState, useContext } from "react";
import "./ProductCard.css";
import { FaStar, FaHeart } from "react-icons/fa";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext"; // ✅ Added Cart Context

function ProductCard({ product, handleAddToCart }) {
  /* ❤️ Wishlist Context */
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart: contextAddToCart } = useContext(CartContext); // ✅ Get cart context
  const isWishlisted = wishlist.some((item) => item.id === product.id);

  /* 🔥 STOCK MANAGEMENT */
  const getInitialStock = () => {
    // Check if this product is already in cart and subtract those quantities
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartItem = cartItems.find((item) => item.id === product.id);
    const cartQuantity = cartItem ? cartItem.quantity : 0;

    // Generate random stock (5-20) and subtract cart quantity
    const baseStock = Math.floor(Math.random() * 16) + 5; // 5-20
    return Math.max(0, baseStock - cartQuantity); // Never go below 0
  };

  const [stock, setStock] = useState(getInitialStock);

  /* 🔥 Discount */
  const getInitialDiscount = () => {
    const saved = localStorage.getItem(`discount_${product.id}`);
    if (saved !== null) return Number(saved);
    const randomDiscount = Math.floor(Math.random() * 50) + 10;
    localStorage.setItem(`discount_${product.id}`, randomDiscount);
    return randomDiscount;
  };

  const [discount] = useState(getInitialDiscount);
  const discountedPrice = Math.floor(product.price - (product.price * discount) / 100);

  /* ⭐ Rating */
  const getInitialRating = () => {
    const saved = localStorage.getItem(`rating_${product.id}`);
    if (saved !== null) return Number(saved);
    const newRating = Number((Math.random() * 2 + 3).toFixed(1));
    localStorage.setItem(`rating_${product.id}`, newRating);
    return newRating;
  };

  const [rating] = useState(getInitialRating);
  const starCount = Math.round(rating);

  /* ✨ Animation */
  const addAnimation = () => {
    const btn = document.getElementById(`btn-${product.id}`);
    if (btn) {
      btn.classList.add("animate-btn");
      setTimeout(() => btn.classList.remove("animate-btn"), 300);
    }
  };

  /* 🛒 Add to cart - WITH STOCK CHECK */
  const addToCart = () => {
    if (stock > 0) {
      // Try to add to cart context
      const added = contextAddToCart(product, stock);
      if (added) {
        setStock(stock - 1);
        addAnimation();
        if (handleAddToCart) handleAddToCart(product);
      }
    }
  };

  return (
    <div className="card product-card p-3 position-relative">
      {/* PRODUCT IMAGE */}
      <img
        src={
          product.images && product.images.length > 0
            ? product.images[0]
            : product.image || "https://via.placeholder.com/200"
        }
        height="200"
        className="card-img-top"
        alt={product.title}
        style={{ objectFit: "contain" }}
      />

      <div className="card-body">
        {/* ❤️ Wishlist button */}
        <div className="text-end mb-2">
          <FaHeart
            size={20}
            style={{ cursor: "pointer" }}
            color={isWishlisted ? "crimson" : "#bbb"}
            onClick={() => {
              toggleWishlist(product);
              // Force a small delay to show update (optional)
            }}
          />
        </div>

        {/* Title */}
        <h5 className="card-title">
          {product.title.length > 25
            ? product.title.substring(0, 25) + "..."
            : product.title}
        </h5>

        {/* ⭐ Rating */}
        <div className="d-flex align-items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              size={18}
              color={i < starCount ? "#ffc107" : "#ddd"}
            />
          ))}
          <span className="ms-2 text-muted">{rating}</span>
        </div>

        {/* Discount */}
        <span className="badge bg-danger mb-2">{discount}% OFF</span>

        {/* Stock Badge */}
        {stock > 0 ? (
          <span className="badge bg-success mb-2">In Stock ({stock} left)</span>
        ) : (
          <span className="badge bg-secondary mb-2">Out of Stock</span>
        )}

        {/* Prices */}
        <p className="card-text fw-bold text-success mb-1">₹ {discountedPrice}</p>
        <p className="text-muted" style={{ textDecoration: "line-through" }}>₹ {product.price}</p>

        {/* Buttons */}
        {stock === 0 ? (
          <button className="btn btn-secondary w-100" disabled>
            <i className="bi bi-x-circle"></i> Out of Stock
          </button>
        ) : stock < 3 ? (
          <button className="btn btn-warning w-100 add-btn" onClick={addToCart}>
            <i className="bi bi-exclamation-triangle"></i> Only {stock} left!
          </button>
        ) : (
          <button className="btn btn-primary w-100 add-btn" onClick={addToCart}>
            <i className="bi bi-cart-plus"></i> Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
