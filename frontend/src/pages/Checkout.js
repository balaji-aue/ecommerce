import React from 'react';
import { createPaymentIntent } from '../services/api';

export default function Checkout() {
  const pay = async () => {
    const res = await createPaymentIntent(19.99);
    alert('Received client secret: ' + res.data.clientSecret);
  };

  return (
    <div>
      <h2>Checkout</h2>
      <button onClick={pay}>Pay $19.99 (test)</button>
    </div>
  );
}
