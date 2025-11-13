# Freelance Marketplace - Server

Node.js + Express backend for Freelance Marketplace. Handles jobs/tasks CRUD operations, user authentication via Firebase, and MongoDB data storage.

---

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