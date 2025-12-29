import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateMe } from '../services/api';
import { AuthContext } from '../AuthContext';

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setMobile(user.mobile || '');
    }
  }, [user]);

  if (!user) return null;

  const submit = async () => {
    try {
      setSaving(true);
      const res = await updateMe({ firstName, lastName, mobile });
      setUser(res.data);
      setSaving(false);
      navigate('/');
    } catch (e) {
      setSaving(false);
      console.error(e);
      alert('Failed to update profile');
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Edit profile</h3>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="first name" />
      <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="last name" />
      <input value={mobile} onChange={e => setMobile(e.target.value)} placeholder="mobile" />
      <div style={{ marginTop: 8 }}>
        <button onClick={submit} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        <button onClick={() => navigate('/')} style={{ marginLeft: 8 }}>Cancel</button>
      </div>
    </div>
  );
}
