# Digital Agency Backend

Phase 1 provides the standalone Express foundation for the Digital Agency API. It does not modify or serve the Next.js frontend.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` to your MongoDB Atlas connection string. `MONGODB_DNS_SERVERS` defaults to `8.8.8.8,1.1.1.1` for reliable Atlas SRV resolution and can be overridden with a comma-separated IP list.
3. Run `npm install`.
4. Run `npm run dev` for development, or `npm start` for production.

The API listens on `http://localhost:5000` by default. In development, it can start without `MONGODB_URI` so the health endpoint remains available; database-backed endpoints will be added in later phases. Production fails fast when `MONGODB_URI`, `JWT_SECRET`, or `CLIENT_URL` are missing.

## MongoDB Atlas

Create a cluster and database user in Atlas, allow the server's IP address, then place the connection string in `MONGODB_URI`. Do not put credentials in source code.

## Current API

- `GET /api/health` — reports service and database connection status.

Additional content collections, Cloudinary uploads, and richer frontend API integration are deliberately deferred to later phases.

## Admin and homepage CMS

Run `npm run seed:admin` once after configuring `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, and a 12+ character `SEED_ADMIN_PASSWORD` in `.env`. The script never runs automatically and never prints the password.

The Phase 2 routes are `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `GET /api/homepage`, and the protected `GET`/`PUT /api/admin/homepage`.
