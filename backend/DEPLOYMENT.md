# Expense Tracker Backend

Node.js + Express + Prisma ORM + PostgreSQL

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with demo data
npm run prisma:seed

# Start development server
npm run dev
# Backend runs on http://localhost:4000

# Or use production build
npx tsc -p .
node dist/src/index.js
```

## Environment Variables

```
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key-here
NODE_ENV=development
PORT=4000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Expenses
- `GET /api/expenses` - Get user's expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Categories (Global)
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category

### Health
- `GET /health` - Health check

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for full deployment guide.

### Railway Quick Deploy

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Environment Variables for Production

Set these on your deployment platform:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Random secure string (use `openssl rand -base64 32`)
- `NODE_ENV` - Set to "production"

## Database

Uses Prisma ORM with PostgreSQL. Schema:
- **User** - Accounts with email/password
- **Category** - Global expense categories (shared by all users)
- **Expense** - User expenses linked to categories

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT + bcrypt
- **Validation**: Zod
