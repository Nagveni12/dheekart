export const getProducts = async () => {
  try {
    const res = await fetch("https://dummyjson.com/products?limit=100");

    if (!res.ok) {
      throw new Error("API Error");
    }

    const data = await res.json();
    return data.products;    // dummyjson gives { products: [] }
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};
