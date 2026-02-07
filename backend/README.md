# Expense-Pro Backend

This backend uses Node + Express + TypeScript + Prisma.

Quick start (local dev with SQLite):

1. Copy `.env.example` to `.env` and ensure `DATABASE_URL` is set. For quick local dev, keep `DATABASE_URL="file:./dev.db"`.

2. Install deps and run prisma migrations + seed:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init --preview-feature
npm run prisma:seed
npm run dev
```

If you prefer Postgres, set `DATABASE_URL` accordingly.

Endpoints:
- `POST /api/auth/register` - body: `{email,password,name?}`
- `POST /api/auth/login` - body: `{email,password}`
- `GET /api/expenses` - auth
- `POST /api/expenses` - auth
- `PUT /api/expenses/:id` - auth
- `DELETE /api/expenses/:id` - auth
- `GET /api/categories` - auth
- `POST /api/categories` - auth
