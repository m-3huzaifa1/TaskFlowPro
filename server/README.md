# TaskFlowPro Backend

## Overview
REST API for a task management system built with MongoDB, Express, and Socket.io.

---

## Features
- **JWT Authentication**  
- **Task Management** (CRUD + recurrence)  
- **Real‑Time Notifications** via Socket.io  
- **Role‑Based Access Control**  
- **Audit Logging** of user actions  
- **MongoDB Aggregations** for analytics  

---

## Technologies
- **Runtime:** Node.js 18+  
- **Framework:** Express.js  
- **Database:** MongoDB + Mongoose  
- **Real‑Time:** Socket.io  
- **Auth:** JSON Web Tokens (JWT)  
- **Testing:** Jest + Supertest  

---

## Setup

1. **Install dependencies**  
   ```bash
   npm install
   ```

2. **Environment variables**
   Create a `.env` file at project root:

   ```env
   MONGODB_URI=mongodb://localhost:27017/taskflowpro  
   ACCESS_TOKEN_SECRET=your_jwt_secret  
   REFRESH_TOKEN_SECRET=your_refresh_secret  
   PORT=5000  
   ```

3. **Start the server**

   ```bash
   npm start       # Production
   npm run dev     # Development
   ```

4. **Run tests**

   ```bash
   npm test
   ```

---

## API Endpoints

| Method | Endpoint                | Description                        |
| ------ | ----------------------- | ---------------------------------- |
| POST   | `/api/auth/register`    | User registration                  |
| POST   | `/api/auth/login`       | User login                         |
| GET    | `/api/tasks?filter=...` | Get tasks (all/my/created/overdue) |
| POST   | `/api/tasks`            | Create new task                    |
| PUT    | `/api/tasks/:id/assign` | Assign task to a user              |
| DELETE | `/api/tasks/:id`        | Delete a task                      |

**Example:** Create a task

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Demo Task",
  "dueDate": "2024-12-31",
  "priority": "High",
  "recurrence": "weekly"
}
```

---

## Database Schema

```js
{
  title:        String,
  description:  String,
  dueDate:      Date,
  priority:     { type: String, enum: ['Low','Medium','High'] },
  status:       { type: String, enum: ['Todo','InProgress','Done'] },
  createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recurrence:   { type: String, enum: ['none','daily','weekly','monthly'] }
}
```
## Assumptions & Trade‑offs

### Authentication

* JWTs used for stateless scalability
* Refresh tokens stored in memory

### Real‑Time

* Socket.io rooms keyed by user ID
* No persistence of historical notifications

### Testing

* Focused on critical paths (auth + task CRUD)
* MongoDB is mocked for unit tests

### Security

* Role checks 
* Mongoose validators 

### Deployment

* **Frontend:** Render
* **Backend:** Render
* **Database:** MongoDB Atlas

---

