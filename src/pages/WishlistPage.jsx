import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

const WishlistPage = () => {
  const { wishlist } = useContext(WishlistContext);

  return (
    <div style={{ padding: "20px" }}>
      <h2>❤️ My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>No products wishlisted yet!</p>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
