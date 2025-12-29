import React, { createContext, useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { getCart, setCart as setCartAPI, clearCart as clearCartAPI } from './services/api';

export const CartContext = createContext();

const ANON_KEY = 'cart:v1:anon';
const USER_PREFIX = 'cart:v1:user:';

function loadFromKey(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) { console.error('Failed to load cart', e); return []; }
}

function saveToKey(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) { console.error('Failed to save cart', e); }
}

function mergeCarts(a = [], b = []) {
  const map = new Map();
  [...a, ...b].forEach(i => {
    const id = i.product && i.product._id;
    if (!id) return;
    const prev = map.get(id) || { product: i.product, qty: 0 };
    prev.qty = Math.min((prev.qty || 0) + (i.qty || 0), i.product && i.product.stock ? i.product.stock : Infinity);
    map.set(id, prev);
  });
  return Array.from(map.values());
}

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]); // { product, qty }
  const prevUserRef = useRef(null);
  const suppressSyncRef = useRef(false); // suppress server sync during init/merge
  const saveTimeoutRef = useRef(null);

  // Initialize/load based on user
  useEffect(() => {
    const prevUser = prevUserRef.current;
    const anonKey = ANON_KEY;
    const prevKey = prevUser ? (USER_PREFIX + prevUser._id) : anonKey;
    const newKey = user ? (USER_PREFIX + user._id) : anonKey;

    // If we switched users, ensure previous cart is persisted (mirror to localStorage)
    if (prevUser && prevKey !== newKey) {
      try { saveToKey(prevKey, items); } catch (e) { /* ignore */ }
    }

    if (user) {
      // logging in - fetch server cart, merge anon cart into user's cart
      (async () => {
        suppressSyncRef.current = true;
        try {
          const resp = await getCart().catch(() => ({ data: { items: [] } }));
          const userCart = (resp && resp.data && resp.data.items) || [];
          const anonCart = loadFromKey(anonKey);
          let merged = userCart || [];
          if ((anonCart && anonCart.length) > 0) {
            merged = mergeCarts(userCart || [], anonCart || []);
            // Persist merged to server and local
            try { await setCartAPI(merged.map(i => ({ product: i.product && i.product._id, qty: i.qty }))); } catch (e) { console.error('Failed to persist merged cart to server', e); }
            saveToKey(newKey, merged);
            try { localStorage.removeItem(anonKey); } catch (e) { }
          }
          setItems(merged || []);
        } catch (e) { console.error('Failed to load user cart', e); setItems([]); }
        // small delay to avoid double-sync from setItems triggered above
        setTimeout(() => { suppressSyncRef.current = false; }, 50);
      })();
    } else {
      // logged out - load anonymous cart
      const anonCart = loadFromKey(anonKey);
      setItems(anonCart || []);
    }

    prevUserRef.current = user;
  }, [user]);

  // Persist items to current key when items change
  useEffect(() => {
    const key = user ? (USER_PREFIX + user._id) : ANON_KEY;
    saveToKey(key, items);

    // If logged in, persist to server as well (debounced)
    if (!user) return;
    if (suppressSyncRef.current) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const payload = items.map(i => ({ product: i.product && i.product._id, qty: i.qty }));
        await setCartAPI(payload);
      } catch (e) { console.error('Failed to persist cart to server', e); }
    }, 250);

    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [items, user]);

  function addToCart(product, qty = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.product._id === product._id);
      if (existing) {
        return prev.map(i => i.product._id === product._id ? { ...i, qty: Math.min((i.qty || 0) + qty, product.stock || Infinity) } : i);
      }
      return [...prev, { product, qty: Math.min(qty, product.stock || Infinity) }];
    });
  }

  function removeFromCart(productId) {
    setItems(prev => prev.filter(i => i.product._id !== productId));
  }

  function updateQty(productId, qty) {
    const q = Number(qty) || 0;
    setItems(prev => prev.map(i => i.product._id === productId ? { ...i, qty: q } : i).filter(i => i.qty > 0));
  }

  async function persistCart() {
    if (!user) return;
    try {
      const payload = items.map(i => ({ product: i.product && i.product._id, qty: i.qty }));
      await setCartAPI(payload);
    } catch (e) { console.error('Failed to persist cart to server', e); }
  }

  function clearCart() {
    setItems([]);
    if (user) {
      (async () => {
        try {
          await clearCartAPI();
        } catch (e) { console.error('Failed to clear server cart', e); }
      })();
    }
  }

  const totalItems = items.reduce((s, i) => s + (Number(i.qty) || 0), 0);
  const totalPrice = items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.product.price) || 0), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice, persistCart }}>
      {children}
    </CartContext.Provider>
  );
}
