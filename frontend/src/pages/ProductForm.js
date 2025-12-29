import React, { useState } from 'react';
import { createProduct } from '../services/api';

export default function ProductForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      price: Number(price),
      description,
      category,
      stock: Number(stock),
      images: images.split(',').map(s => s.trim()).filter(Boolean),
    };

    await createProduct(payload);
    setName(''); setPrice(''); setDescription(''); setCategory(''); setStock(0); setImages('');
    window.location.reload();
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      <h2 style={{ gridColumn: '1 / -1' }}>Add Product</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
      <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" type="number" required />
      <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" />
      <input value={stock} onChange={e => setStock(e.target.value)} placeholder="Stock" type="number" />
      <input value={images} onChange={e => setImages(e.target.value)} placeholder="Image URLs (comma separated)" style={{ gridColumn: '1 / -1' }} />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" style={{ gridColumn: '1 / -1' }} />
      <div style={{ gridColumn: '1 / -1' }}>
        <button type="submit">Create</button>
      </div>
    </form>
  );
}
