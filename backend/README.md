# Ecommerce Backend (Nest-style scaffold)

This folder contains a NestJS-style backend scaffold for an ecommerce app.

Quick start (after installing dependencies):

```bash
# from backend/
npm install
npm run start:dev
```

Environment variables: copy `.env.example` to `.env` and update values.

Endpoints:
- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- `POST /orders/create-payment-intent` (Stripe)

