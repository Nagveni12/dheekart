import React, { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";

function Home({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ⭐ Auto-generate categories from API products
  const categories = ["All Categories", ...new Set(products.map(p => p.category))];

  // ⭐ Combined Search + Category filtering
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.title
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchCategory =
      selectedCategory === "All Categories" ||
      product.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  // ⭐ Add to Cart + Toast
  const handleAddToCart = (product) => {
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    let updatedCart = [...cart];

    if (existingIndex !== -1) {
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    toast.success(`${product.title.substring(0, 30)}... added to cart!`);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Home</h1>

      {/* 🔍 Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* 🔽 Category Filter */}
      <div className="mb-4 text-center">
        <select
          className="form-select w-50 mx-auto"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Skeleton Loader */}
      {loading && (
        <div className="row">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div className="card p-3">
                  <Skeleton height={200} />
                  <Skeleton count={2} style={{ marginTop: "10px" }} />
                  <Skeleton width={100} height={30} style={{ marginTop: "10px" }} />
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Error */}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Actual Products */}
      {!loading && !error && (
        <div className="row g-4">
          {filteredProducts.length === 0 && (
            <h4 className="text-center text-muted">No products found</h4>
          )}

          {filteredProducts.map((product) => (
            <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
              <ProductCard
                product={product}
                handleAddToCart={handleAddToCart}
                // ✅ No need for initialStock - ProductCard handles it internally!
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;