import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import Login from './pages/Login';
import { AuthProvider, AuthContext } from './AuthContext';
import { fetchProducts } from './services/api';

function Header({ user, onLogout, search, setSearch, category, setCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchProducts();
        const cats = Array.from(new Set((res.data || []).map(p => p.category).filter(Boolean)));
        setCategories(cats);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '12px 18px', background: '#0f172a', color: '#fff', borderRadius: 8 }}>
      <div style={{ fontSize: 18, fontWeight: 700 }}><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>MyKartDL</Link></div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, marginLeft: 16 }}>
        <input
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ width: 180, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        >
          <option value="">All</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ fontSize: 13 }}>Signed in as <strong>{user.email}</strong> ({user.role})</span>
            <button onClick={onLogout} style={{ padding: '6px 10px', borderRadius: 6 }}>Logout</button>
          </>
        ) : (
          <Link to="/login"><button style={{ padding: '6px 10px', borderRadius: 6 }}>Login</button></Link>
        )}
      </div>
    </header>
  );
}

function Inner() {
  const { user, logout } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  return (
    <div>
      <Header user={user} onLogout={logout} search={search} setSearch={setSearch} category={category} setCategory={setCategory} />

      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={
            <>
              {user && user.role === 'admin' && <div style={{ marginTop: 20 }}><Link to="/products/new"><button style={{ padding: '8px 12px', borderRadius: 6 }}>Add product</button></Link></div>}
              <hr />
              <ProductList search={search} category={category} />
            </>
          } />

          <Route path="/products" element={<ProductList search={search} category={category} />} />

          <Route path="/products/new" element={user && user.role === 'admin' ? <ProductForm /> : <Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />

        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ maxWidth: 1100, margin: '18px auto' }}>
          <Inner />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
