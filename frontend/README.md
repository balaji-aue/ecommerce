# Ecommerce Frontend (React)

This is a minimal React scaffold that communicates with the backend to list/add products and create a Stripe payment.

Quick start:

```bash
# from frontend/
npm install
npm start
```

Update `src/services/api.js` to point to your backend if needed.

Auth & admin:
- Use the login form on the main page (or register) to get a token stored in `localStorage`.
- Admin users (role `admin`) will see the Add Product form and Delete buttons; normal users can search and filter products.

Checkout and UPI demo:
- The checkout page now supports managing shipping addresses for logged-in users and placing orders (`POST /orders`).
- A demo UPI payment option is available (renders a QR code). The demo UPI ID defaults to `demo@upi` but can be customized by setting `REACT_APP_DEMO_UPI` when starting the frontend.
- For local testing, after placing an order the cart is cleared (client and server).
