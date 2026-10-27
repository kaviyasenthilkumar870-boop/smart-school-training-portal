# Smart School Training Portal

A complete, modern, responsive multi-school training and event attendance management web application.

---

## 🌟 Key Features

1. **One Central Multi-School Architecture:**
   - Add new schools whenever a training programme is conducted.
   - Each school has isolated students, assigned staff, events, and attendance records.

2. **3 Role-Based Access Control (RBAC):**
   - **Main Administrator:** Add & manage schools, users, multi-school events, and export attendance analytics to CSV.
   - **Training Staff:** Scoped to assigned schools only; view registered participants; mark **Present** or **Absent** on event day; export roster to CSV.
   - **Student:** View events open to their school; one-click registration; prevents duplicate registrations; view verified attendance and printable participation certificates.

3. **100% Reliable Data Persistence:**
   - All added schools, users, events, registrations, and attendance records are stored on disk (`backend/data/db.json`) and in MongoDB (when connected).
   - **Even if you refresh the page or restart the server, your data stays intact!**

---

## 🚀 Quick Start (Beginner Friendly)

### Option 1: One-Click Startup (Windows)
Double-click:
`start-all.bat`

This opens both the Backend (Port 5000) and Frontend (Port 3000) in separate command windows.

### Option 2: Running via Terminal

**Terminal 1 — Start the Backend:**
```powershell
cd C:\Users\DSK\.gemini\antigravity\scratch\smart-school-portal\backend
node server.js
```
The backend starts at `http://localhost:5000`.

**Terminal 2 — Start the Frontend:**
```powershell
cd C:\Users\DSK\.gemini\antigravity\scratch\smart-school-portal\frontend
npm run dev
```
Open your browser and navigate to:
**`http://localhost:3000`**

---

## 🔑 Default Demo Accounts

All accounts use the password: `password123`

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Main Admin** | `admin@smartschool.edu` | `password123` | Full administrative control |
| **Training Staff** | `trainer.david@smartschool.edu` | `password123` | Assigned to Greenwood High & Oakridge Academy |
| **Student** | `emma.student@greenwood.edu` | `password123` | Enrolled at Greenwood High School |

*(You can also click the quick-login buttons directly on the login page or in the navbar to switch between roles instantly!)*

---

## 🗄️ Database & MongoDB Configuration

- The backend includes full Mongoose schemas (`School`, `User`, `Event`, `Registration`, `Attendance`).
- It automatically persists to `backend/data/db.json` so you can use the application immediately without installing anything extra.
- To connect to MongoDB (Local or MongoDB Atlas Cloud), simply update `backend/.env`:
  ```env
  MONGODB_URI=mongodb://127.0.0.1:27017/smart_school
  # OR Atlas Cloud:
  # MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart_school?retryWrites=true&w=majority
  ```

---

## 🧪 Testing

To run the automated end-to-end test suite:
```powershell
cd C:\Users\DSK\.gemini\antigravity\scratch\smart-school-portal\backend
node test-e2e.js
```
All 11 tests (authentication, multi-school creation, duplicate prevention, attendance marking, CSV reporting, and disk persistence) will execute and verify.
