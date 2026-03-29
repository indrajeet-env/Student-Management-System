# Student Management System (ERP)

A simple full-stack ERP system to manage students, authentication, and attendance.  
Built with a focus on clean backend logic and minimal frontend to demonstrate functionality.

---

## What this project does

- Users can register and login  
- Every user is assigned the **student** role by default  
- Admin role is assigned manually from the database  
- Students can:
  - View their attendance  
  - See monthly attendance stats  
- Admins can:
  - View all students  
  - Check attendance of any student  

---

## Tech Stack

**Backend**
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT Authentication  
- bcrypt (password hashing)  

**Frontend**
- React (Vite)  
- Axios  

---

## 📁 Project Structure

```text
ERP/
├── backend/
└── frontend/
```

---

## ⚙️ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:
```env
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

Run the server:
```bash
npm run dev
```

---

## API Overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Student
- `GET /api/attendance/me`
- `GET /api/attendance/monthly?month=&year=`

### Admin (Protected)
- `GET /api/admin/students`
- `GET /api/admin/attendance/:studentId`
- `GET /api/admin/attendance/:studentId/monthly?month=&year=`

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in the frontend:
```env
VITE_API_URL=http://localhost:5001
```

---

## Authentication
- JWT-based authentication
- Token stored in localStorage

---

## HOSTED URL

- [URL](https://student-management-system-frontend-7ich.onrender.com)
