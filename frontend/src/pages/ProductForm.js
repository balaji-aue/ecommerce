import React, { useState } from 'react';
import { createProduct } from '../services/api';

export default function ProductForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await createProduct({ name, price: Number(price) });
    setName(''); setPrice('');
    window.location.reload();
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 20 }}>
      <h2>Add Product</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
      <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" type="number" required />
      <button type="submit">Create</button>
    </form>
  );
}
