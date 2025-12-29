import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function ProfileView() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  const name = ((user.firstName || user.lastName) ? `${(user.firstName || '').trim()} ${(user.lastName || '').trim()}`.trim() : (user.name || user.email));

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Profile</h3>
      <div style={{ marginBottom: 8 }}>
        <strong>Name:</strong> {name}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Email:</strong> {user.email}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Mobile:</strong> {user.mobile || '-'}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Role:</strong> {user.role}
      </div>

      <div style={{ marginTop: 12 }}>
        <Link to="/profile/edit"><button style={{ padding: '6px 8px', borderRadius: 6 }}>Edit profile</button></Link>
        <button onClick={() => navigate('/')} style={{ marginLeft: 8 }}>Done</button>
      </div>
    </div>
  );
}
