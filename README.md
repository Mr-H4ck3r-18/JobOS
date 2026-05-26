# AI Job Search Dashboard

A low-cost, production-oriented dashboard for job discovery, resume matching, resume tailoring, application tracking, and automation run history.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui conventions
- Prisma
- Supabase Auth, PostgreSQL, and Storage
- Framer Motion
- Recharts

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Fill in Supabase and database values.

4. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

5. Run the app:

   ```bash
   npm run dev
   ```

## Safety Rule

Application submission must stay manual. Automation may prepare drafts and logs, but real applications require approval first.
