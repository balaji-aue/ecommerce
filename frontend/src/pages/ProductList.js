import React, { useEffect, useState } from 'react';
import { fetchProducts, deleteProduct } from '../services/api';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  const load = async () => {
    const res = await fetchProducts();
    setProducts(res.data || []);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map(p => (
          <li key={p._id}>
            <strong>{p.name}</strong> — ${p.price} — Stock: {p.stock}
            <button onClick={async () => { await deleteProduct(p._id); load(); }} style={{ marginLeft: 8 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
