# THRIFTCYCLE

A small second-hand marketplace demo built with Next.js, TypeScript, Prisma, and SQLite. It includes account registration and login, a seeded marketplace to browse, user and admin dashboards, and sample listings and orders.

## Requirements

- Node.js 18.18 or newer (Node.js 20 LTS recommended)
- npm (included with Node.js)

You do not need to install Prisma globally or run a separate database server. Prisma is installed with the project, and SQLite keeps the database in a local file.

## Run locally

Clone the repository, then from its directory:

```bash
npm install
cp .env.example .env
```

Open `.env` and replace the example `AUTH_SECRET` with a private random value. For example, on macOS or Linux:

```bash
openssl rand -base64 32
```

Copy the generated value into `.env`. Keep `.env` private; it is ignored by Git.

Create the local SQLite database, apply migrations, and load demo data:

```bash
npx prisma migrate dev
npm run db:seed
```

Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo accounts

| Role / status | Email | Password |
| --- | --- | --- |
| Admin | `admin@thriftcycle.test` | `Admin@12345` |
| Verified user | `maya@thriftcycle.test` | `CycleDemo123!` |
| Verified user | `arjun@thriftcycle.test` | `CycleDemo123!` |
| Unverified user | `tara@thriftcycle.test` | `CycleDemo123!` |

The admin dashboard shows marketplace counts, pending listing examples, and sample orders. User dashboards show that account's verification status, listings, and orders. Browse the seeded listings at `/browse`.

## Useful commands

```bash
npm run dev       # Start the development server
npm run build     # Generate Prisma Client and build for production
npm run start     # Start the production build
npm run lint      # Run ESLint
npm run db:seed   # Load or refresh the demo data
```

To start over with a fresh local database, stop the app, remove `prisma/dev.db`, and run the migration and seed commands again. The database file is local and ignored by Git.

## Current demo scope

Registration, credential login, role-based page access, seeded browsing, and populated dashboards are available. The seeded admin and regular accounts are useful for exploring the different views.

Verification review, creating and moderating listings, checkout, and advancing order logistics are not wired up as interactive workflows yet. The dashboard queue and order entries are sample data for exploring the interface. Listing images are illustrative placeholders, and this demo does not connect to a payment provider or send email.
