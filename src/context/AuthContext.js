import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    const savedCart = localStorage.getItem('cart');
    
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      // In a real app, this would be an API call
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      const existingUser = users.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      const newUser = {
        id: Date.now(),
        ...userData
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // DON'T auto-login after registration
      // Just return success - user will be redirected to login
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    setCurrentUser(null);
    setCart([]);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let newCart;
    
    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    
    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const value = {
    currentUser,
    cart,
    register,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateQuantity
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};