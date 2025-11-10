# FuelEU Maritime Compliance Dashboard

## Overview

This project is a full-stack implementation of the FuelEU Maritime compliance platform.  
It allows monitoring, comparison, banking, and pooling of ship compliance balances (CB) based on CO₂ intensity data.

**Frontend:** React + TypeScript + TailwindCSS  
**Backend:** Node.js + TypeScript + Express + PostgreSQL (via Prisma ORM)  
**Architecture:** Hexagonal (Ports & Adapters / Clean Architecture)

The dashboard provides four main modules:

1. **Routes** – List all shipping routes and manage baseline selection.  
2. **Compare** – Compare GHG intensity against baseline routes.  
3. **Banking** – Bank surplus compliance and apply to deficit ships.  
4. **Pooling** – Create pools of ships to optimize compliance balances.

---

## Architecture Summary

src/
core/
domain/ # Entities and business logic
application/ # Use-cases implementing domain rules
ports/ # Abstract interfaces for adapters
adapters/
inbound/http/ # Express routes (HTTP API)
ui/ # React components, pages, hooks
outbound/postgres/ # Prisma client and DB queries
infrastructure/
db/ # Prisma migrations and seeds
server/ # App server setup
shared/ # Utilities and shared constants


- **Core Layer**: Contains domain entities, use-cases, and ports (no framework dependency).  
- **Adapters**: Implement communication between core and outside world (API / DB / UI).  
- **Infrastructure**: Prisma ORM, migrations, seed scripts, server initialization.

---

## Setup & Run Instructions

### 1. Clone repository

```bash
git clone https://github.com/Prabalbaijal/Prabal_Varuna_Assignment
cd backend```
 
### 2.Environment Variables

Create a .env file in the backend root:

DATABASE_URL="postgresql://neondb_owner:npg_XcD9Yp6xMbHn@ep-lively-hill-ahy2sn75-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
PORT=9000

###3.Install Dependencies 

# Backend
npm install

# Frontend
cd ../frontend
npm install

# Run migrations
cd backend
npx prisma migrate dev --name init

# Seed database
npx prisma db seed

# Backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

# Sample Requests / Responses

## Routes

**Request**  

```http
GET /routes?year=2024
**Response**

{
  "data": [
    { "routeId": "R001", "vesselType": "Container", "fuelType": "HFO", "year": 2024, "ghgIntensity": 91.0, "isBaseline": true },
    { "routeId": "R002", "vesselType": "BulkCarrier", "fuelType": "LNG", "year": 2024, "ghgIntensity": 88.0, "isBaseline": false }
  ]
}

```
**Screenshot**  

![Routes Tab Screenshot](../frontend/public/screenshots/routes.png)

## Banking

**Request**

```POST /banking/bank
Content-Type: application/json

{
  "shipId": "R002",
  "year": 2024,
  "amount": 50
}

**Response**

{
  "shipId": "R002",
  "year": 2024,
  "banked": 50
}
```

**Screenshot**  

![Banking Tab Screenshot](../frontend/public/screenshots/banking.png)

## Pooling

**Request**

```POST /pools
Content-Type: application/json

{
  "year": 2024,
  "members": [
    { "shipId": "R001", "cbBefore": 100 },
    { "shipId": "R002", "cbBefore": -50 }
  ]
}

**Response**

{
  "poolId": 1,
  "members": [
    { "shipId": "R001", "cbBefore": 100, "cbAfter": 50 },
    { "shipId": "R002", "cbBefore": -50, "cbAfter": 0 }
  ]
}


```

**Screenshot**  

![Pooling Tab Screenshot](../frontend/public/screenshots/pooling.png)


**Screenshot**  

![Comparison Tab Screenshot](../frontend/public/screenshots/comparison.png)