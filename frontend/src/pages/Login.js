import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, setAuthToken } from '../services/api';
import { AuthContext } from '../AuthContext';

export default function Login() {
  const { user, setUser, setToken } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const submit = async () => {
    try {
      if (mode === 'login') {
        const res = await login({ email, password });
        const token = res.data.access_token;
        localStorage.setItem('token', token);
        setAuthToken(token);
        setToken(token);
        const meRes = await (await import('../services/api')).me();
        setUser(meRes.data);
        navigate('/');
      } else {
        await register({ email, password });
        setMode('login');
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
      <button onClick={submit}>{mode === 'login' ? 'Login' : 'Register'}</button>
      <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ marginLeft: 8 }}>{mode === 'login' ? 'Create account' : 'Back to login'}</button>
    </div>
  );
}