import React from 'react';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useAuth();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container">
        <h2>Your Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p>${item.price}</p>
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="btn btn-small"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="btn btn-small"
                >
                  +
                </button>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <h3>Total: ${total.toFixed(2)}</h3>
        <button className="btn btn-primary">Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;