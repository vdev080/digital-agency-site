# API Reference

Base URL during development: `http://localhost:5000`

## Health

`GET /api/health`

Authentication: none.

Response (`200 OK`):

```json
{
  "success": true,
  "status": "ok",
  "database": "connected"
}
```

`database` is `disconnected` when no MongoDB connection is available. It never includes connection details.

## Authentication

- `POST /api/auth/login` — public; accepts `{ "email": "...", "password": "..." }` and sets an httpOnly cookie.
- `POST /api/auth/logout` — clears the authentication cookie.
- `GET /api/auth/me` — authenticated; returns the signed-in administrator without password data.

## Homepage CMS

- `GET /api/homepage` — public; returns the saved homepage document.
- `GET /api/admin/homepage` — authenticated; returns the editable homepage document or safe defaults for first-time setup.
- `PUT /api/admin/homepage` — authenticated; creates or updates the singleton homepage document.
