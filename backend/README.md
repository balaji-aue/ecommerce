# Ecommerce Backend (Nest-style scaffold)

This folder contains a NestJS-style backend scaffold for an ecommerce app.

Quick start (after installing dependencies):

```bash
# from backend/
npm install
npm run start:dev
```

Environment variables: copy `.env.example` to `.env` and update values. At minimum set `MONGO_URI` and `JWT_SECRET`.

Auth endpoints:
- `POST /auth/register` — register (default role: `user`)
- `POST /auth/login` — returns { access_token }
- `GET /auth/me` — requires Authorization: Bearer <token>

Product endpoints:
- `GET /products` — supports query params `search` and `category`
- `GET /products/:id`
- `POST /products` — **admin only**
- `PUT /products/:id` — **admin only**
- `DELETE /products/:id` — **admin only**

Notes:
- To create an initial admin, register a user via `/auth/register` then update its `role` to `admin` in the database (e.g., via Mongo shell or UI).

Testing locally:
1. From `backend/` run `npm install` then `npm run start:dev` (set `JWT_SECRET` and `MONGO_URI` in `.env`).
2. Register a user: `curl -X POST http://localhost:4000/auth/register -H 'Content-Type: application/json' -d '{"email":"admin@example.com","password":"secret"}'`
3. Make the user an admin in MongoDB: `db.users.updateOne({ email: 'admin@example.com' }, { $set: { role: 'admin' } })`.
4. Login: `curl -X POST http://localhost:4000/auth/login -H 'Content-Type: application/json' -d '{"email":"admin@example.com","password":"secret"}'` — save `access_token` and use `Authorization: Bearer <token>` for protected endpoints.
5. From `frontend/` run `npm install` and `npm start`, then login via the UI.

If you want, I can add a small seed script to create an admin automatically (requires storing credentials in `.env`).

