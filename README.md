# FinTrack – Phase 0

AI-Powered Personal Finance Tracker. Built with Next.js 14, PostgreSQL, Prisma, TailwindCSS, and JWT authentication.

---

## ⚡ Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org/) — **install before proceeding**
- PostgreSQL running locally (already installed on your machine)

---

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/finance_tracker?schema=public"
JWT_SECRET="some-long-random-secret-string-minimum-32-characters"
```

> To find your PostgreSQL password, it's whatever you set during installation. Default user is `postgres`.

### 3. Create the database

Open **pgAdmin** or **psql** and run:

```sql
CREATE DATABASE finance_tracker;
```

### 4. Push schema & seed categories

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page.

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # register, login, logout
│   │   ├── transactions/  # CRUD
│   │   ├── dashboard/     # summary endpoint
│   │   └── categories/    # list categories
│   ├── login/             # Login page
│   ├── register/          # Register page
│   └── dashboard/         # Protected pages
│       ├── page.tsx        # Dashboard overview
│       ├── add/page.tsx    # Add Transaction
│       └── history/page.tsx # Transaction History
├── components/
│   └── AppLayout.tsx      # Sidebar with mobile drawer
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   ├── auth.ts            # JWT sign/verify + cookies
│   └── api.ts             # Response helpers
├── prisma/
│   ├── schema.prisma      # DB schema
│   └── seed.ts            # Category seed data
└── middleware.ts           # Route protection
```

---

## 🔌 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login & get cookie |
| POST | `/api/auth/logout` | ✅ | Clear session cookie |
| GET | `/api/transactions` | ✅ | List transactions (filterable) |
| POST | `/api/transactions` | ✅ | Create transaction |
| PUT | `/api/transactions/:id` | ✅ | Update transaction |
| DELETE | `/api/transactions/:id` | ✅ | Delete transaction |
| GET | `/api/dashboard/summary` | ✅ | Income/expense totals + recent |
| GET | `/api/categories` | ❌ | List all categories |

---

## 🗄️ Database Schema

- **users** – id, name, email, password_hash, created_at  
- **categories** – id, name, type (income/expense)  
- **transactions** – id, user_id, amount, category_id, type, description, transaction_date, created_at

---

## 🔐 Security

- Passwords hashed with **bcrypt** (12 rounds)
- Sessions via **HttpOnly JWT cookies** (7-day expiry)  
- All dashboard routes protected by **Next.js middleware**
- Input validated with **Zod** on every API endpoint
