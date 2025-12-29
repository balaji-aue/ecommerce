import React, { useEffect, useState, useContext } from 'react';
import { fetchProducts, deleteProduct } from '../services/api';
import { AuthContext } from '../AuthContext';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const { user } = useContext(AuthContext);

  const load = async (params) => {
    const res = await fetchProducts(params);
    setProducts(res.data || []);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Products</h2>
      <div style={{ marginBottom: 10 }}>
        <input placeholder="Search" value={q} onChange={e => setQ(e.target.value)} />
        <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} style={{ marginLeft: 8 }} />
        <button onClick={() => load({ search: q, category })} style={{ marginLeft: 8 }}>Apply</button>
        <button onClick={() => { setQ(''); setCategory(''); load(); }} style={{ marginLeft: 8 }}>Clear</button>
      </div>
      <ul>
        {products.map(p => (
          <li key={p._id}>
            <strong>{p.name}</strong> — ${p.price} — Stock: {p.stock}
            {user && user.role === 'admin' && (
              <button onClick={async () => { await deleteProduct(p._id); load(); }} style={{ marginLeft: 8 }}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
