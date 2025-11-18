# Freelance Marketplace - Server

Node.js + Express backend for Freelance Marketplace. Handles jobs/tasks CRUD operations, user authentication via Firebase, and MongoDB data storage.

---

## 📌 Project Overview

A secure Express.js backend API for freelance marketplace operations including authentication, job posting, applications, and user role management.

## 🛠️ Main Technologies

Node.js

Express.js

MongoDB / Mongoose

Firebase Admin SDK (JWT verification)

## ✨ Key Features

Firebase token verification middleware

CRUD operations for jobs

User role & permissions handling

Protected routes for authenticated users

MongoDB database operations

Error handling & response standardization

CORS-enabled API

Environment variable protection

## 📦 Dependencies

express

mongodb

cors

dotenv

firebase-admin

nodemon (dev)

## Installation

```bash
git clone https://github.com/HasinIshrakK/Freelance_MarketPlace_server-side
cd Freelance_MarketPlace_server-side
npm install
npm start

```

## Environment Variables

DB_USER – MongoDB username

DB_PASS – MongoDB password

PORT – Server port (default 3000)

FIREBASE_ADMIN_KEY – Path to Firebase service account JSON

## API Endpoints

GET /jobs – Get all jobs

POST /jobs – Add a new job (requires token)

GET /my-jobs?email=... – Get jobs posted by a user

PATCH /jobs/:id – Update a job

DELETE /jobs/:id – Delete a job

POST /accepted-jobs – Accept a job

GET /my-accepted-jobs?email=... – Get accepted jobs

DELETE /accepted-jobs/:id – Remove accepted job