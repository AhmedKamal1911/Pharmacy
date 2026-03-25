---
trigger: always_on
---

Here is the updated **Pharmacy Backend Guidelines**, incorporating **PGlite** and the detailed file responsibilities in the exact order and format you requested.

---

# 🏥 Pharmacy Backend Guidelines

## 🧰 Tech Stack

- **Runtime:** Node.js / Electron
- **Framework:** Express.js
- **Database:** **PGlite** (WASM-based Postgres for local persistence)
- **Language:** TypeScript (Strict Mode)
- **Architecture:** RESTful API (DDD / Feature-Based)

---

## 📌 Project Context

We are building a RESTful API for a Desktop Pharmacy Application.

### ⚠️ Critical Requirements

- **Data Integrity:** Use Postgres-level constraints locally.
- **Security:** Proper local data encryption and validation.
- **Accurate Calculations:** High precision for Inventory & Currency.

---

## 📁 Folder Structure (Feature-Based / DDD)

```text
src/
├── server.ts                # Entry point: Initializes PGlite & starts the Express server
├── app.ts                   # Express config: Middlewares, global routes, & error handling
├── database.ts              # PGlite instance & Prisma Client initialization
├── types/                   # Global TypeScript interfaces and custom namespaces
├── utils/                   # Global helpers (Currency conversion, Date formatting)
├── middlewares/             # Auth, Zod Validation, & Global Error Handler
└── modules/                 # Business Logic grouped by Feature
    └── [feature-name]/
        ├── [feature].routes.ts      # URL mapping (e.g., POST /sales)
        ├── [feature].controller.ts  # Handles req/res; no logic allowed
        ├── [feature].service.ts     # Business logic & Pharmacy Domain rules
        ├── [feature].repository.ts  # Direct PGlite/Prisma database queries
        ├── [feature].validators.ts  # Zod schemas for body/params validation
        └── [feature].utils.ts       # Specialized helpers for the specific feature
```

---

## 🏗️ Architecture Rules

**Routes → Controller → Service → Repository → Database**

- **Routes:** No logic; strictly for routing and middleware attachment.
- **Controllers:** Handle `req/res` only. Extract data and send responses.
- **Services:** Where the "Pharmacy Brain" lives. All business logic goes here.
- **Repositories:** Database-only. The only place where `prisma` or `pglite` is called.

---

## 🧠 TypeScript Rules

- `strict: true` in `tsconfig.json`.
- **No `any`:** Use unknown or specific types.
- **Interfaces/Types:** Always define contracts for data shapes.
- **Return Types:** Explicitly define function return types (e.g., `Promise<TSale>`).

---

## ✅ Validation Middleware (Zod)

Use a `validateRequest` middleware to validate `body`, `params`, and `query` using Zod schemas defined in `[feature].validators.ts`.

---

## 🚨 Error Handling

- Use a centralized error handler in `app.ts`.
- Use custom error classes (e.g., `InsufficientStockError`).
- Always wrap async functions in a `try/catch` or use an `asyncWrapper` utility.

---

## 💊 Pharmacy Domain Rules

### 💰 Currency

- **Store money as integers** (smallest unit).
- **Example:** $10.50 \rightarrow 1050$. Avoid floating-point math for transactions.

### 🔒 Transactions

Use ACID transactions via `prisma.$transaction` for:

- Recording sales.
- Inventory stock updates (Decrement/Increment).

### ⚡ Concurrency

- **Prevent overselling:** Use atomic operations or Postgres row-level locks within PGlite.
- Ensure the local system handles "Busy" states if multiple processes hit the local DB.

### 🧾 Soft Delete

- **Never hard delete** important records (Medicine, Sales, Patients).
- **Example:** `deletedAt: Date | null`.

---

## 🧹 Coding Style

- ES6+ syntax.
- `camelCase` for variables and functions.
- `PascalCase` for types, interfaces, and classes.
- Prefer `const` over `let`.
- Small, reusable, "pure" functions.

---

## 🚀 Final Note

This system handles real money and medical stock. Mistakes = real loss. With **PGlite**, your local database now matches your production Postgres capabilities—use that power to write safe, precise, production-ready code.

**Would you like me to generate the `database.ts` file to show you how to initialize the PGlite persistent storage path?**
