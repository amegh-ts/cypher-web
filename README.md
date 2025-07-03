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

````bash
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


---

## 🔧 .env Setup

Create a `.env.local` file:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key
SESSION_COOKIE_NAME=cypher-session
NEXT_PUBLIC_APP_URL=http://localhost:3000
````

---

## 🛠️ Development

```bash
yarn install
yarn dev
```

Runs locally at `http://localhost:3000`

---

## 🚢 Deployment

### 📦 Vercel

1. Push your code to GitHub
2. Connect the repo on [Vercel](https://vercel.com/)
3. Set environment variables in Vercel dashboard
4. Done ✅

### 🐳 Docker (optional)

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
```

Then:

```bash
docker build -t cypher-dashboard .
docker run -p 3000:3000 --env-file .env.local cypher-dashboard
```

---

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

### 🧪 In Progress

- [ ] User CRUD module
- [ ] File uploads
- [ ] Feedback table UI
- [ ] Settings page (profile, password, preferences)

### 🔜 Coming Soon

- [ ] Dashboard charts (via Recharts or Chart.js)
- [ ] Activity logs
- [ ] Export to CSV
- [ ] Mobile responsiveness
