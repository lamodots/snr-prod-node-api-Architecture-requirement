# 📦 Express + Prisma + PostgreSQL Project Template

A NestJS-inspired architecture pattern implemented in Node.js + Express.js with Prisma ORM and PostgreSQL (Neon free tier). This template demonstrates how to build scalable, testable, and maintainable APIs using the Modular + Layered + Dependency Injection (DI) approach.

## 🚀 Features

- Modular structure → Feature-based modules (e.g., users, products)
- Layered architecture → Clear separation of concerns: Controllers → Services → Repositories → Database
- Manual Dependency Injection → Explicit DI chain for better testability and flexibility
- Prisma ORM integration → Type-safe queries, migrations, and PostgreSQL support
- REST API endpoints → Example CRUD operations for User entity
- Ready-to-use template → Easily extendable for new modules

## 📂 Project Structur

### Modular Structure

Break your app into feature-based modules

```bash
src/
  users/
    users.model.ts
    users.repository.ts
    users.service.ts
    users.controller.ts
    users.routes.ts
  common/
    prisma.ts
    /middleware
    /utils
  app.ts
  server.ts

```

### 📂 Folder & File Explanations

`src/users/`
This is a feature module for the `users` domain. Each feature gets its own folder, keeping code modular and organized.

- `users.model.ts`
  - What it does: Defines the shape of the User entity (TypeScript interface or Prisma schema reference).
  - Why we have it: Provides type safety and a single source of truth for user data.
  - Best practices:
    - Keep models simple and focused on data structure.
    - Use TypeScript interfaces or Prisma-generated types.
- `users.repository.ts`
  - What it does: Handles database operations (CRUD) using Prisma.
  - Why we have it: Separates persistence logic from business logic.
  - Best practices:
    - Keep repository methods small and reusable.
    - Never mix business rules here — only DB queries.
- `users.service.ts`
  - What it does: Contains business logic (validation, transformations, orchestration).
  - Why we have it: Keeps controllers thin and makes logic reusable.
  - Best practices:
    - Services should call repositories, not the database directly.
    - Keep services stateless where possible.
- `users.controller.ts`
  - What it does: Handles HTTP requests/responses. Maps routes to service methods.
  - Why we have it: Separates API layer from business logic.
- Best practices:
  - Controllers should be thin — delegate to services.
  - Handle request validation and response formatting here.
- `users.routes.ts`
  - What it does: Defines Express routes for the users module.
  - Why we have it: Keeps route definitions modular and easy to register in `app.ts.`
- Best practices:

  - Group related routes together.
  - Apply middleware (auth, validation) at the route level.

- `src/common/`
  Shared utilities and configurations used across modules.

- `prisma.ts`
  - What it does: Creates a single Prisma client instance.
  - Why we have it: Prevents multiple DB connections and centralizes DB access.
- Best practices:
  - Export one Prisma client for the whole app.
  - Handle connection lifecycle properly (disconnect on shutdown).
- `/middleware`
  - What it does: Contains Express middleware (e.g., logging, error handling, validation).
  - Why we have it: Keeps cross-cutting concerns separate from business logic.
- Best practices:
  - Centralize error handling here.
  - Use middleware for request validation, security (CORS, rate limiting).
- `/utils`
  - What it does: Helper functions (e.g., formatters, constants, reusable logic).
  - Why we have it: Avoids duplication and keeps code DRY.
- Best practices:
  - Keep utilities pure (no side effects).
  - Organize by domain (e.g., dateUtils.ts, stringUtils.ts).

#### Root Files

- `app.ts`
  - What it does: Initializes Express app, registers middleware and routes.
  - Why we have it: Central place for app configuration.
- Best practices:
  - Keep app.ts focused on wiring modules together.
  - Don’t put business logic here.
- `server.ts`
  - What it does: Starts the server and listens on a port.
  - Why we have it: Separates app configuration (app.ts) from runtime execution.
- Best practices:
  - Keep this file minimal — just start the app.
  - Useful for testing (you can import app.ts without starting the server).

#### 🎯 Why This Structure?

- Modular: Each feature (users, products, etc.) is isolated.
- Layered: Clear separation of concerns (Controller → Service → Repository → DB).
- Reusable: Shared logic lives in `common/`.
- Maintainable: Easy to scale as the project grows.
- Testable: Each layer can be unit-tested independently.

#### ✅ Best Practices Summary

- Keep controllers thin → delegate to services.
- Keep services focused → orchestrate logic, call repositories.
- Keep repositories clean → only database queries.
- Use manual DI → instantiate dependencies explicitly for clarity.
- Centralize middleware & utils → avoid duplication.
- Separate `app.ts` (setup) and `server.ts` (execution) → improves testability.

## ⚙️ Tech Stack

- Node.js
- Express.js
- PostgreSQL (Neon free pg database)
- Prisma ORM
- TypeScript

## 📖 Getting Started

- Clone the repository

```bash
git clone https://github.com/lamodots/snr-prod-node-api-Architecture-requirement.git
cd snr-prod-node-api-Architecture-requirement.git
```

- Install dependencies

```bash
npm install
```

- Configure with your Neon PostgreSQL connection string

```bash
DATABASE_URL="postgresql://<username>:<password>@<host>/<database>?sslmode=require"
```

- Run migrations & generate Prisma client

```bash
npx prisma migrate dev --name init
npx prisma generate
```

- Start the server

```bash
npm run dev
```

## 🎯 Why This Template?

This project is designed to help developers:

- Learn and apply NestJS-style architecture in Express.js
- Build enterprise-ready APIs with clean separation of concerns
- Quickly bootstrap projects with Prisma + PostgreSQL integration

## 🤝 Contributing

Contributions are welcome! Here’s how you can help improve this template:

- Fork the repository
- Create a new branch for your feature or fi

```bash
git checkout -b feature/your-feature-name
```

- Make your changes (add modules, improve DI, enhance documentation, etc.)
- Commit and push your changes

```bash
git commit -m "Add new feature: your-feature-name"
git push origin feature/your-feature-name
```

- Open a Pull Request describing your changes
  Please ensure your contributions follow the Modular + Layered + DI pattern so the project remains consistent and maintainable.

## 📜 License

This project is licensed under the MIT License. You are free to use, modify, and distribute this template in both personal and commercial projects. See the LICENSE file for details.
