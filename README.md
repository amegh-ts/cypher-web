# 🧩 Cypher Dashboard

This is an admin panel build to manage CYPHER.

---

## 🚀 Tech Stack

- **Next.js 14 (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **MongoDB** (via Mongoose)
- **JWT (jose)** for stateless authentication
- **Zod** for schema validation
- **React Hook Form** for form handling
- **Render** or **Vercel** for deployment

---

## 📦 Features

- 🔐 JWT-based auth with session cookies
- ✅ Role-based access: `user`, `admin`, `owner`
- 📁 File management, feedback tracking, settings module
- 📄 Dashboard overview with analytics-ready endpoints
- 🌐 Middleware to enforce auth and permissions
- 🧠 Token-based session restore via cookies
- 📜 Lean database reads for performance
- 🔒 Separate protected and admin-only routes
- 🧹 Auto-redirect for invalid/expired sessions

---

## 📂 Folder Structure

```bash
.
├── app/
│   ├── dashboard/          # Protected routes
│   ├── login/              # Auth routes
│   ├── welcome/            # Default page for users
│   ├── unauthorized/       # 403 page
├── lib/
│   ├── auth.ts             # Auth helpers (verifyToken, createToken, etc.)
│   ├── config.ts           # App + session config
│   ├── mongodb.ts          # DB connection handler
├── models/
│   ├── User.ts
│   ├── Admins.ts
├── middleware.ts          # Global route protection & role access
├── .env.local             # Environment variables

```

---

## 🔧 .env Setup

Create a `.env.local` file:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key
SESSION_COOKIE_NAME=cypher-session
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🛠️ Development

```bash
yarn install
yarn dev
```

Runs locally at `http://localhost:3000`

---

## 🚢 Deployment

### 📦 PM2

`1. Install Dependencies & Build`

```bash
yarn install
yarn build
```

`2. Start PM2`

```bash
pm2 start "yarn start" --name cypher-app
```

`3. Manage PM2`

```bash
pm2 logs
pm2 stop cypher-app
pm2 restart cypher-app
pm2 delete cypher-app
```

### 📦 Vercel

1. Push your code to GitHub
2. Connect the repo on [Vercel](https://vercel.com/)
3. Set environment variables in Vercel dashboard
4. Done ✅

### 🐳 Docker Deployment

```bash
docker build -t cypher .
docker run -d --name cypher-admin --env-file .env -p 3660:3000 cypher
```

> 3660 is the host system port.

`Stop the container`

```bash
docker stop cypher-admin
docker rm cypher-admin
```

---

### 🐳 Docker Compose

```bash
docker-compose up -d --build
```

`Stop the containers`

```bash
docker-compose down
```

## 🔐 Authentication Flow

- User logs in → JWT is created via `createToken()` and stored as a secure `HttpOnly` cookie.
- Middleware verifies token on every request:

  - Invalid/expired → redirect to `/login`
  - Valid token with correct role → proceed

- Auth routes (`/login`, `/register`) redirect to `/dashboard` or `/welcome` if already logged in.

---

## 🔒 Role-Based Access

| Route                 | Role Access      |
| --------------------- | ---------------- |
| `/dashboard/...`      | `admin`, `owner` |
| `/dashboard/users`    | `owner` only     |
| `/login`, `/register` | Guests only      |
| `/welcome`            | `user`           |

---

## ✅ Progress Tracker

### ✅ Core Features

- [x] MongoDB integration
- [x] JWT auth with `jose`
- [x] Middleware route protection
- [x] Admin/user role logic
- [x] Token storage in `HttpOnly` cookie
- [x] API route protection
- [x] Tailwind UI with reusable components
- [x] Dashboard charts (via Recharts or Chart.js)
- [x] Feedback table UI
- [x] Activity logs

### 🧪 In Progress

- [ ] User CRUD module
- [ ] File uploads
- [ ] Settings page (profile, password, preferences)

### 🔜 Coming Soon

- [ ] Export to CSV
- [ ] Mobile responsiveness
