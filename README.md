# Employee Leave Management System

This project is built as part of the **Assessment**. It covers problem-solving, API development, and system design.  

---

## 🚀 Part 1 — Problem Solving & Core Development

### Features
- **Add a New Employee**
- **Apply for Leave**
- **Approve / Reject Leave**
- **Fetch Leave Balance**

### ✅ Edge Cases Handled
- Applying for leave **before joining date**.
- Applying for **more days than available balance**.
- **Overlapping leave requests**.
- **Employee not found**.
- **Invalid dates** (e.g., end date before start date).
- Leave request without specifying dates.
- Duplicate employee entries.

---

## 🏗️ Part 2 — High Level System Design

### Architecture Overview
- **Frontend** (React / Any UI framework)  
- **Backend** (Node.js + Express)  
- **Database** (MongoDB with Mongoose)  

### API & DB Interaction
1. **Employee Service** → Stores employee details.  
2. **Leave Service** → Manages leave applications.  
3. **DB** → MongoDB used for persistence.  
4. API requests flow:  
   `Frontend → Backend APIs → Database → Response to Frontend`.

### Scalability (50 → 500 employees)
- Horizontal scaling of backend (Node.js servers behind a load balancer).
- MongoDB cluster with **replica sets** for reliability.  
- Caching frequently accessed data (e.g., leave balances).  
- Queues (e.g., RabbitMQ/Kafka) for handling high-volume leave requests asynchronously.  

---

## 🎁 Bonus
- Deployment on **Render/Heroku/Vercel** (free tier).  
- README with setup steps, assumptions, and improvements.  

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (>= 16.x)
- MongoDB (local or cloud e.g., MongoDB Atlas)
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# Install dependencies
npm install

# Setup environment variables (.env)
MONGO_URI=your_mongodb_connection_string
PORT=5000

# Run the server
npm start

API Endpoints
Employees

POST /api/employees → Add new employee

GET /api/employees/:id → Fetch employee details

Leave

POST /api/leaves/apply → Apply for leave

POST /api/leaves/approve/:id → Approve leave

POST /api/leaves/reject/:id → Reject leave

GET /api/leaves/balance/:id → Get leave balance

Assumptions

Each employee starts with a fixed 20 days leave balance.

Employees cannot apply for leave before their joining date.

Overlapping leave requests are not allowed.

Leave balance is updated only when leave is approved.

Potential Improvements

Role-based authentication (Employee / Manager / Admin).

Notifications (email/slack) for approvals/rejections.

Dashboard for employees to track leave history.

Support for half-day leaves.

Integration with HR systems (e.g., payroll).
Architecture Diagram
[Frontend]  →  [Backend APIs]  →  [Database (MongoDB)]
                     ↑
                     |
               [Scaling via Load Balancer + Replica DB]
