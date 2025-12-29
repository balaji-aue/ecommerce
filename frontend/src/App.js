import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import ProductList from './pages/ProductList';
import Sidebar from './components/Sidebar';
import ProductForm from './pages/ProductForm';
import Login from './pages/Login';
import Cart from './pages/Cart';
import { AuthProvider, AuthContext } from './AuthContext';
import { CartProvider, CartContext } from './CartContext';
import { fetchProducts } from './services/api';

function Header({ user, onLogout }) {
  const { totalItems, persistCart } = React.useContext(CartContext);
  const handleLogout = async () => {
    try {
      await persistCart();
    } catch (e) { /* ignore */ }
    onLogout();
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '12px 18px', background: '#0f172a', color: '#fff', borderRadius: 8, height: 64, boxSizing: 'border-box' }}>
      <div style={{ fontSize: 18, fontWeight: 700 }}><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>MyKartDL</Link></div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Link to="/cart" style={{ color: 'inherit', textDecoration: 'none' }}><button style={{ padding: '6px 8px', borderRadius: 6 }}>Cart ({totalItems})</button></Link>
        {user ? (
          <>
            <span style={{ fontSize: 13 }}>Signed in as <strong>{user.email}</strong> ({user.role})</span>
            <button onClick={handleLogout} style={{ padding: '6px 10px', borderRadius: 6 }}>Logout</button>
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
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchProducts();
        const cats = Array.from(new Set((res.data || []).map(p => p.category).filter(Boolean)));
        setCategories(cats);
      } catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header user={user} onLogout={logout} />

      <div style={{ display: 'flex', gap: 16, padding: 20, flex: 1, boxSizing: 'border-box', minHeight: 0 }}>
        {location.pathname !== '/login' && location.pathname !== '/cart' && (
          <aside style={{ width: 260, alignSelf: 'flex-start', maxHeight: '100%', overflowY: 'auto' }}>
            <Sidebar
              search={search} setSearch={setSearch}
              category={category} setCategory={setCategory}
              categories={categories}
              minPrice={minPrice} setMinPrice={setMinPrice}
              maxPrice={maxPrice} setMaxPrice={setMaxPrice}
              sort={sort} setSort={setSort}
            />
          </aside>
        )}

        <main style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={
              <>
                {user && user.role === 'admin' && <div style={{ marginTop: 20 }}><Link to="/products/new"><button style={{ padding: '8px 12px', borderRadius: 6 }}>Add product</button></Link></div>}
                <hr />
                <ProductList search={search} category={category} minPrice={minPrice} maxPrice={maxPrice} sort={sort} />
              </>
            } />

            <Route path="/products" element={<ProductList search={search} category={category} minPrice={minPrice} maxPrice={maxPrice} sort={sort} />} />

            <Route path="/products/new" element={user && user.role === 'admin' ? <ProductForm /> : <Navigate to="/login" replace />} />

            <Route path="/cart" element={<Cart />} />

            <Route path="/login" element={<Login />} />

          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div style={{ maxWidth: 1100, margin: '18px auto', height: 'calc(100vh - 36px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Inner />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
