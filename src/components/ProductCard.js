import React from 'react';
import { useAuth } from '../context/AuthContext';
import moengage from "@moengage/web-sdk";

const ProductCard = ({ product }) => {
  const { addToCart } = useAuth();

  const handleAddToCart = () => {

    moengage.track_event("AddtoCart", {
        "ProductName": product.name, // string value
        "ProductDescription": product.description,
        "ProductPrice": product.price
    });

    addToCart(product);
    alert('Product added to cart!');
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <p className="product-price">${product.price}</p>
      <button onClick={handleAddToCart} className="btn btn-primary">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;