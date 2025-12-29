import React from 'react';
import { createPaymentIntent } from '../services/api';
import React, { useContext } from 'react';
import { CartContext } from '../CartContext';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useContext(CartContext);

  const pay = async () => {
    if (items.length === 0) return alert('Cart is empty');
    const res = await createPaymentIntent(totalPrice);
    alert('Received client secret: ' + res.data.clientSecret);
    // in a real app we'd complete payment flow; here we'll clear the cart
    clearCart();
  };

  return (
    <div>
      <h2>Checkout</h2>
      <div style={{ marginTop: 12 }}>
        <div><strong>Items:</strong> {items.length}</div>
        <div><strong>Total:</strong> ${totalPrice.toFixed(2)}</div>
        <div style={{ marginTop: 12 }}>
          <button onClick={pay} style={{ padding: '8px 12px', borderRadius: 6, background: '#0f172a', color: '#fff' }}>Pay ${totalPrice.toFixed(2)}</button>
        </div>
      </div>
    </div>
  );
}
