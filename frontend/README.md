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
