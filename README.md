# Fullstack Ecommerce (NestJS + React + MongoDB) Scaffold

This workspace contains a scaffold for an ecommerce app selling electronic spare parts.

Folders:
- `backend/` — NestJS-style backend (TypeScript)
- `frontend/` — React frontend (Create React App style)
- `docker-compose.yml` — MongoDB service

Quick start:

1. Start MongoDB via Docker Compose:

```bash
cd /workspace/ecommerce
docker compose up -d
```

2. Backend:

```bash
cd backend
npm install
cp .env.example .env
# update .env if needed
npm run start:dev
```

3. Frontend:

```bash
cd frontend
npm install
npm start
```

Notes:
- Add your Stripe secret to `backend/.env` (`STRIPE_SECRET`).
- The backend listens on port 4000 by default.

Importing sample products (migration) 🔧
- Script: `backend/scripts/importProducts.js` — fetches products from https://dummyjson.com/products and inserts them into the backend `products` collection.
- Ensure MongoDB is running (e.g., `docker compose up -d`) and set `MONGO_URI` in `backend/.env` if needed (defaults to `mongodb://localhost:27017/ecommerce`).
- From the project root run:
  - `cd backend && node scripts/importProducts.js`
  - To drop existing products before importing: `cd backend && node scripts/importProducts.js --drop`
- Or use the npm script:
  - `cd backend && npm run import:products`
  - With drop: `cd backend && npm run import:products -- --drop`

