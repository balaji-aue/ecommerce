import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../CartContext';
import { AuthContext } from '../AuthContext';
import { getAddresses, createAddress, createOrder } from '../services/api';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newAddr, setNewAddr] = useState({ line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India', phone: '', label: '', isDefault: false });
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const DUMMY_UPI_ID = process.env.REACT_APP_DEMO_UPI || 'demo@upi';

  useEffect(() => {
    if (!user) return;
    setLoadingAddresses(true);
    getAddresses().then(res => { setAddresses(res.data || []); if (res.data && res.data.length) setSelectedAddressId(res.data[0]._id); }).catch(() => setAddresses([])).finally(() => setLoadingAddresses(false));
  }, [user]);

  const handleAddAddress = async () => {
    try {
      setAdding(true);
      const res = await createAddress(newAddr);
      setAddresses(prev => [res.data, ...prev]);
      setSelectedAddressId(res.data._id);
      setNewAddr({ line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India', phone: '', label: '', isDefault: false });
      setAdding(false);
    } catch (e) {
      setAdding(false);
      alert('Failed to add address');
    }
  };

  const buildUpiUri = (amount) => {
    // Simple UPI URI demo; real apps should use a UPI payload generator
    const pa = encodeURIComponent(DUMMY_UPI_ID);
    const pn = encodeURIComponent('Demo Merchant');
    const am = encodeURIComponent(amount.toFixed(2));
    const cu = 'INR';
    const tn = encodeURIComponent('Order payment');
    return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}&tn=${tn}`;
  };

  const pay = async () => {
    if (items.length === 0) return alert('Cart is empty');
    if (!user) return alert('Please log in to place an order');

    const selectedAddress = addresses.find(a => a._id === selectedAddressId) || null;

    try {
      const payload = { items: items.map(i => ({ product: i.product._id, qty: i.qty })), address: selectedAddress, total: totalPrice, paymentMethod };
      const res = await createOrder(payload);
      // For demo, if UPI selected, show QR (user pays externally), but we mark order as created
      alert('Order created: ' + (res.data && res.data._id));
      clearCart();
    } catch (e) {
      console.error(e);
      alert('Failed to create order');
    }
  };

  return (
    <div>
      <h2>Checkout</h2>

      <div style={{ marginTop: 12 }}>
        <div><strong>Items:</strong> {items.length}</div>
        <div><strong>Total:</strong> ${totalPrice.toFixed(2)}</div>
        <div style={{ marginTop: 8 }}>
          <button onClick={pay} style={{ padding: '8px 12px', borderRadius: 6, background: '#0f172a', color: '#fff' }}>Pay</button>
        </div>

        <hr />

        <h3>Shipping address</h3>
        {user ? (
          <div>
            {loadingAddresses ? <div>Loading addresses...</div> : (
              <div>
                {addresses.length === 0 && <div>No addresses yet. Add one below.</div>}
                {addresses.map(a => (
                  <label key={a._id} style={{ display: 'block', marginBottom: 6 }}>
                    <input type="radio" name="address" checked={selectedAddressId === a._id} onChange={() => setSelectedAddressId(a._id)} />
                    <span style={{ marginLeft: 8 }}>{a.label ? (a.label + ' — ') : ''}{a.line1}{a.city ? ', ' + a.city : ''}{a.state ? ', ' + a.state : ''}{a.postalCode ? ' - ' + a.postalCode : ''}</span>
                  </label>
                ))}

                <div style={{ marginTop: 8 }}>
                  <h4>Add new address</h4>
                  <input placeholder="Label (e.g., Home)" value={newAddr.label} onChange={e => setNewAddr({ ...newAddr, label: e.target.value })} style={{ display: 'block', marginBottom: 6 }} />
                  <input placeholder="Address line 1" value={newAddr.line1} onChange={e => setNewAddr({ ...newAddr, line1: e.target.value })} style={{ display: 'block', marginBottom: 6 }} />
                  <input placeholder="Address line 2" value={newAddr.line2} onChange={e => setNewAddr({ ...newAddr, line2: e.target.value })} style={{ display: 'block', marginBottom: 6 }} />
                  <input placeholder="City" value={newAddr.city} onChange={e => setNewAddr({ ...newAddr, city: e.target.value })} style={{ display: 'block', marginBottom: 6 }} />
                  <input placeholder="State" value={newAddr.state} onChange={e => setNewAddr({ ...newAddr, state: e.target.value })} style={{ display: 'block', marginBottom: 6 }} />
                  <input placeholder="Postal Code" value={newAddr.postalCode} onChange={e => setNewAddr({ ...newAddr, postalCode: e.target.value })} style={{ display: 'block', marginBottom: 6 }} />
                  <input placeholder="Phone" value={newAddr.phone} onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })} style={{ display: 'block', marginBottom: 6 }} />
                  <label style={{ display: 'block', marginBottom: 6 }}><input type="checkbox" checked={newAddr.isDefault} onChange={e => setNewAddr({ ...newAddr, isDefault: e.target.checked })} /> Set as default</label>
                  <button onClick={handleAddAddress} disabled={adding} style={{ padding: '6px 10px', marginTop: 6 }}>{adding ? 'Adding...' : 'Add address'}</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>Please log in to manage addresses and place orders.</div>
        )}

        <hr />

        <h3>Payment</h3>
        <label><input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} /> UPI (QR)</label>
        <label style={{ marginLeft: 12 }}><input type="radio" name="payment" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} /> Card (Stripe)</label>

        {paymentMethod === 'upi' && (
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center' }}>
            <div>
              <div>Pay using UPI to <strong>{DUMMY_UPI_ID}</strong></div>
              <div style={{ marginTop: 8 }}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(buildUpiUri(totalPrice))}`} alt="QR code" />
              </div>
            </div>
            <div style={{ marginLeft: 12 }}>
              <div>Scan the QR with your UPI app to pay {`₹${totalPrice.toFixed(2)}`}</div>
              <div style={{ marginTop: 12 }}>
                <button onClick={pay} style={{ padding: '8px 12px', borderRadius: 6, background: '#0f172a', color: '#fff' }}>Place order</button>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'stripe' && (
          <div style={{ marginTop: 12 }}>
            <div>Card payment will use Stripe in a real app. For demo, placing the order will create it without capturing payment.</div>
            <div style={{ marginTop: 12 }}>
              <button onClick={pay} style={{ padding: '8px 12px', borderRadius: 6, background: '#0f172a', color: '#fff' }}>Place order</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
