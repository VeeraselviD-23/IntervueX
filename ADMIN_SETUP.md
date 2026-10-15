# IntervueX Admin Setup

The project now includes an admin authentication flow, protected admin routes, dynamic dashboard statistics, admin profile editing, and password change APIs.

## Admin account

From the `server` folder run:

```bash
npm install
npm run create-admin
```

The existing `createAdmin.js` creates the default admin only if it does not already exist.

Default login:
- Email: `admin@intervuex.com`
- Password: `Admin@123`

Change the password immediately from **Admin Dashboard → Settings**.

## Run backend

```bash
cd server
npm install
npm run dev
```

Backend: `http://localhost:5000`

## Run frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## Admin flow

1. Open the frontend.
2. Login with the admin account.
3. The login page redirects an admin to `/admin/dashboard`.
4. Admin routes are protected by JWT and the `admin` role.
5. Dashboard statistics are loaded from MongoDB through `/api/admin/dashboard`.
6. Profile details can be changed from `/admin/settings`.
7. Password can be changed from the same Settings page.

## Important

The server `.env` must contain a valid `MONGO_URI` and `JWT_SECRET`. Do not commit real credentials to GitHub.
