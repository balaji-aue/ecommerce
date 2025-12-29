import React, { useContext, useState } from 'react';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import Login from './pages/Login';
import { AuthProvider, AuthContext } from './AuthContext';

function Header({ user, onLogout, search, setSearch, category, setCategory }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '12px 18px', background: '#0f172a', color: '#fff', borderRadius: 8 }}>
      <div style={{ fontSize: 18, fontWeight: 700 }}>MyKartDL</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, marginLeft: 16 }}>
        <input
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <input
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ width: 160, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ fontSize: 13 }}>Signed in as <strong>{user.email}</strong> ({user.role})</span>
            <button onClick={onLogout} style={{ padding: '6px 10px', borderRadius: 6 }}>Logout</button>
          </>
        ) : (
          <Login />
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
        {user && user.role === 'admin' && <div style={{ marginTop: 20 }}><ProductForm /></div>}

        <hr />
        <ProductList search={search} category={category} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div style={{ maxWidth: 1100, margin: '18px auto' }}>
        <Inner />
      </div>
    </AuthProvider>
  );
}
