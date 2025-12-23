import React from 'react';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Electronics Spare Parts Store</h1>
      <ProductForm />
      <hr />
      <ProductList />
    </div>
  );
}
