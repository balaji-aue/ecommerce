import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../services/api';
import { AuthContext } from '../AuthContext';
import { CartContext } from '../CartContext';

export default function ProductList({ search, category, minPrice, maxPrice, sort }) {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const { addToCart, items } = useContext(CartContext);

  const load = async (params = {}) => {
    const res = await fetchProducts({ search: params.search, category: params.category });
    let items = res.data || [];
    if (params.minPrice) items = items.filter(p => Number(p.price || 0) >= Number(params.minPrice));
    if (params.maxPrice) items = items.filter(p => Number(p.price || 0) <= Number(params.maxPrice));
    if (params.sort === 'price_asc') items.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (params.sort === 'price_desc') items.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    setProducts(items);
  };

  useEffect(() => { load({ search, category, minPrice, maxPrice, sort }); }, [search, category, minPrice, maxPrice, sort]);

  return (
    <div>
      <h2 style={{ marginTop: 18 }}>Products</h2>
      {user && user.role === 'admin' && <div style={{ marginBottom: 12 }}><Link to="/products/new"><button style={{ padding: '8px 12px', borderRadius: 6 }}>Add product</button></Link></div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 12 }}>
        {products.map(p => {
          const qty = items.find(i => i.product._id === p._id)?.qty || 0;
          const effectiveStock = Math.max((p.stock || 0) - qty, 0);
          return (
            <div key={p._id} style={{ width: 200, border: '1px solid #eee', borderRadius: 8, padding: 12, boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
              <div style={{ height: 160, marginBottom: 8, overflow: 'hidden', borderRadius: 6, background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={(p.images && p.images[0]) || 'https://via.placeholder.com/300x200?text=No+Image'} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ fontWeight: 700 }}>{p.name}</div>
              <div style={{ color: '#111', marginTop: 6 }}>${Number(p.price || 0).toFixed(2)}</div>
              <div style={{ color: '#666', fontSize: 13, marginTop: 4 }}>{p.category || ''}</div>
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#444' }}>Stock: {effectiveStock}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button onClick={() => { addToCart(p, 1); }} disabled={effectiveStock <= 0} style={{ padding: '6px 8px' }}>{effectiveStock <= 0 ? 'Out of stock' : (qty > 0 ? `Added (${qty})` : 'Add to cart')}</button>
                  {user && user.role === 'admin' && (
                    <button onClick={async () => { if (window.confirm('Delete product?')) { await deleteProduct(p._id); load({ search, category, minPrice, maxPrice, sort }); } }} style={{ padding: '6px 8px' }}>Delete</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
