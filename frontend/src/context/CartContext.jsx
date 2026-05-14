import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Initialize from localStorage if available
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('pawpal_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('pawpal_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [open, setOpen] = useState(false);

  // Sync with localStorage on every change
  useEffect(() => {
    localStorage.setItem('pawpal_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('pawpal_orders', JSON.stringify(orders));
  }, [orders]);


  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const productId = product.id || product._id;
      const existing = prev.find(i => (i.id || i._id) === productId);
      if (existing) {
        return prev.map(i => (i.id || i._id) === productId 
          ? { ...i, quantity: i.quantity + quantity } 
          : i
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = id => setCart(prev => prev.filter(i => (i.id || i._id) !== id));
  
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setCart(prev => prev.map(i => (i.id || i._id) === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const addOrder = (orderItems, total) => {
    const newOrder = {
      id: `#ORD-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
      date: new Date().toISOString().split('T')[0],
      items: orderItems.map(i => `${i.name} × ${i.quantity}`).join(', '),
      total: `₹${total.toFixed(2)}`,
      status: 'Processing',
      deliveryInfo: `Arriving on ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const cancelOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled', deliveryInfo: 'Order cancelled' } : o));
  };

  const totalCount = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);


  return (
    <CartContext.Provider value={{ 
      cart, 
      orders,
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart, 
      addOrder,
      cancelOrder,
      totalCount, 
      totalPrice, 
      open, 
      setOpen 
    }}>

      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

