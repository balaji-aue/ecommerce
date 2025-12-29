import React, { useContext } from 'react';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import Login from './pages/Login';
import { AuthProvider, AuthContext } from './AuthContext';

function Inner() {
  const { user, logout } = useContext(AuthContext);
  return (
    <div>
      <h1>Electronics Spare Parts Store</h1>
      {user ? (
        <div>
          <span>Signed in as <strong>{user.email}</strong> ({user.role})</span>
          <button style={{ marginLeft: 8 }} onClick={logout}>Logout</button>
        </div>
      ) : (
        <Login />
      )}

      {user && user.role === 'admin' && <div style={{ marginTop: 20 }}><ProductForm /></div>}

      <hr />
      <ProductList />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div style={{ padding: 20 }}>
        <Inner />
      </div>
    </AuthProvider>
  );
}
