import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, setAuthToken } from '../services/api';
import { AuthContext } from '../AuthContext';
import { CartContext } from '../CartContext';

export default function Login() {
  const { user, setUser, setToken } = useContext(AuthContext);
  const { persistCart } = useContext(CartContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const submit = async () => {
    try {
      if (mode === 'login') {
        // Persist any current user's cart first so we don't lose it when replacing the token
        try { await persistCart(); } catch (e) { /* ignore */ }

        const res = await login({ email, password });
        const token = res.data.access_token;
        localStorage.setItem('token', token);
        setAuthToken(token);
        setToken(token);
        const meRes = await (await import('../services/api')).me();
        setUser(meRes.data);
        navigate('/');
      } else {
        // include optional profile fields during registration
        await register({ email, password, firstName, lastName, mobile });
        // switch back to login so user can sign in
        setMode('login');
        // keep fields so user can quickly login; clear password for safety
        setPassword('');
      }
    } catch (e) {
      console.error(e);
      alert('Auth failed');
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>{mode === 'login' ? 'Login' : 'Register'}</h3>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" />

      {mode === 'register' && (
        <>
          <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="first name" />
          <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="last name" />
          <input value={mobile} onChange={e => setMobile(e.target.value)} placeholder="mobile" />
        </>
      )}

      <button onClick={submit}>{mode === 'login' ? 'Login' : 'Register'}</button>
      <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ marginLeft: 8 }}>{mode === 'login' ? 'Create account' : 'Back to login'}</button>
    </div>
  );
}