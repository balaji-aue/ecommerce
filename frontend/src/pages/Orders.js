import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { getOrders } from '../services/api';

export default function Orders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getOrders()
      .then(res => setOrders(res.data || []))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div>
      <h2>My Orders</h2>

      {!user && <div>Please log in to view your orders.</div>}

      {user && (
        <div>
          {loading && <div>Loading orders...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}

          {!loading && orders.length === 0 && <div>No orders yet.</div>}

          <div style={{ marginTop: 12 }}>
            {orders.map((o) => (
              <div key={o._id} style={{ border: '1px solid #e6e6e6', borderRadius: 6, padding: 12, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div><strong>Order:</strong> {o._id}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{new Date(o.createdAt).toLocaleString()}</div>
                </div>

                <div style={{ marginBottom: 6 }}><strong>Status:</strong> {o.status} &nbsp; <strong>Payment:</strong> {o.paymentMethod || '—'}</div>
                <div style={{ marginBottom: 6 }}><strong>Total:</strong> ${((o.total || 0)).toFixed(2)}</div>

                <div style={{ marginBottom: 6 }}>
                  <strong>Items:</strong>
                  <ul>
                    {(o.items || []).map((it, idx) => (
                      <li key={idx}>{it.product}{it.qty ? ` ×${it.qty}` : ''}</li>
                    ))}
                  </ul>
                </div>

                <div><strong>Shipping:</strong> {o.address ? `${o.address.label ? o.address.label + ' — ' : ''}${o.address.line1 || ''} ${o.address.city || ''}` : '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
