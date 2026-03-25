# Pharmacy Backend API

A RESTful API for a Desktop Pharmacy Application built with Node.js, Express, TypeScript, and PGlite.

## 🏥 Features

- **Medicine Management**: CRUD operations for medicines with stock tracking
- **Patient Management**: Patient records and medical history
- **Sales Processing**: Transaction handling with inventory updates
- **Stock Management**: Real-time stock tracking and adjustments
- **Data Persistence**: Local PGlite database with PostgreSQL compatibility
- **Type Safety**: Full TypeScript implementation with strict mode
- **Validation**: Zod-based request validation
- **Error Handling**: Centralized error handling with custom error classes

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PGlite (WASM-based Postgres for local persistence)
- **Language**: TypeScript (Strict Mode)
- **Validation**: Zod
- **ORM**: Prisma with PGlite adapter

## 📁 Project Structure

```
src/
├── server.ts                # Entry point: Initializes PGlite & starts the Express server
├── app.ts                   # Express config: Middlewares, global routes, & error handling
├── database.ts              # PGlite instance & Prisma Client initialization
├── types/                   # Global TypeScript interfaces and custom namespaces
├── utils/                   # Global helpers (Currency conversion, Date formatting)
├── middlewares/             # Auth, Zod Validation, & Global Error Handler
└── modules/                 # Business Logic grouped by Feature
    └── medicine/
        ├── medicine.routes.ts      # URL mapping (e.g., POST /medicines)
        ├── medicine.controller.ts  # Handles req/res; no logic allowed
        ├── medicine.service.ts     # Business logic & Pharmacy Domain rules
        ├── medicine.repository.ts  # Direct PGlite/Prisma database queries
        ├── medicine.validators.ts  # Zod schemas for body/params validation
        └── index.ts               # Module exports
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Generate Prisma client**:
   ```bash
   npm run db:generate
   ```

3. **Push database schema**:
   ```bash
   npm run db:push
   ```

### Development

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **The API will be available at**: `http://localhost:3000`

### Production

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

## 📚 API Documentation

### Health Check
- `GET /health` - Check API status

### Medicine Management
- `POST /api/medicines` - Create new medicine
- `GET /api/medicines` - Get all medicines (with pagination & filtering)
- `GET /api/medicines/:id` - Get medicine by ID
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Soft delete medicine
- `GET /api/medicines/low-stock` - Get low stock medicines
- `GET /api/medicines/category/:category` - Get medicines by category
- `GET /api/medicines/barcode/:barcode` - Search medicine by barcode
- `POST /api/medicines/stock/adjust` - Adjust medicine stock

## 🧾 Database Schema

The application uses the following main entities:

- **Medicine**: Product information, pricing, and stock levels
- **Patient**: Customer/patient information
- **Sale**: Sales transactions with items and payments
- **SaleItem**: Individual items within a sale
- **StockAdjustment**: Stock movement tracking
- **User**: Application users with role-based access

## 💰 Currency Handling

All monetary values are stored as integers representing the smallest currency unit (cents) to avoid floating-point precision issues. Use the provided currency utilities:

- `toMoney(amount)` - Convert decimal to cents
- `fromMoney(cents)` - Convert cents to decimal
- `formatMoney(cents)` - Format as currency string

## 🔒 Security Notes

- All monetary calculations use integer arithmetic
- Stock updates use database transactions
- Input validation on all endpoints
- Soft deletes for data integrity
- Environment-based configuration

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./pharmacy.db"

# Server
PORT=3000
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
BCRYPT_ROUNDS=12

# PGlite
PGLITE_DATA_DIR=./data
```

## 🧪 Architecture Principles

1. **Routes → Controller → Service → Repository → Database**
2. **Controllers**: Handle req/res only, no business logic
3. **Services**: Business logic and domain rules
4. **Repositories**: Database operations only
5. **Validation**: Zod schemas for all inputs
6. **Error Handling**: Centralized with custom error classes
7. **Type Safety**: Strict TypeScript with no `any` types

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Write TypeScript interfaces for all data structures
3. Add proper error handling for all operations
4. Use the provided utilities for currency and date operations
5. Test all endpoints thoroughly

## 📄 License

ISC
