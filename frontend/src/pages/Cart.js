import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../CartContext';

export default function Cart() {
  const { items, updateQty, removeFromCart, totalItems, totalPrice, clearCart } = useContext(CartContext);

  return (
    <div>
      <h2 style={{ marginTop: 18 }}>Cart</h2>
      {items.length === 0 ? (
        <div style={{ marginTop: 12 }}>
          <p>Your cart is empty.</p>
          <Link to="/products"><button style={{ padding: '8px 12px', borderRadius: 6 }}>Continue shopping</button></Link>
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: 8 }}>Product</th>
                <th style={{ padding: 8 }}>Price</th>
                <th style={{ padding: 8 }}>Quantity</th>
                <th style={{ padding: 8 }}>Subtotal</th>
                <th style={{ padding: 8 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ product, qty }) => (
                <tr key={product._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: 8 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <img src={(product.images && product.images[0]) || 'https://via.placeholder.com/80x60?text=No+Image'} alt={product.name} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }} />
                      <div>
                        <div style={{ fontWeight: 700 }}>{product.name}</div>
                        <div style={{ color: '#666', fontSize: 13 }}>{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 8 }}>${Number(product.price || 0).toFixed(2)}</td>
                  <td style={{ padding: 8 }}>
                    <input type="number" min="1" max={product.stock || 9999} value={qty} onChange={e => updateQty(product._id, e.target.value)} style={{ width: 80, padding: 6 }} />
                  </td>
                  <td style={{ padding: 8 }}>${(Number(product.price || 0) * Number(qty || 0)).toFixed(2)}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => removeFromCart(product._id)} style={{ padding: '6px 8px' }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{totalItems}</strong> items • <strong>${totalPrice.toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => clearCart()} style={{ padding: '8px 12px', borderRadius: 6 }}>Clear</button>
              <Link to="/checkout"><button style={{ padding: '8px 12px', borderRadius: 6, background: '#0f172a', color: '#fff' }}>Proceed to checkout</button></Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
