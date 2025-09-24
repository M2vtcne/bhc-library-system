# 📚 BHC Library Borrowing Portal

A simple **Library Borrowing Management System** for students and admins.  
Students can log in with their **Student ID + PIN** to borrow/return books, while admins can manage the collection, borrowers, and track transactions.

Built with **HTML/CSS/Vanilla JS** on the frontend and **Node.js + Express + SQLite** on the backend.

---

## ✨ Features
### 👨‍🎓 Borrower Portal
- Student login using Student ID + PIN.  
- Persistent login using **localStorage** (remains logged in until logout).  
- Borrow available books with one click.  
- Return borrowed books.  
- View currently borrowed books.  
- Logout option for manual control.  

### 🛠️ Admin Dashboard
- Manage **books** (CRUD with cover images).  
- Manage **borrowers** (CRUD with Student ID, PIN, course, etc.).  
- Track **transactions** (borrowed/returned).  
- Export reports (**CSV, PDF, JSON**) using frontend tools.  
- View stats/charts (via Chart.js).  

### ⚙️ API (SQLite backend)
- CRUD endpoints for **books**, **borrowers**, and **transactions**.  
- Auto-seeds with sample Filipino books (with cover images).  

---

## 🛠️ Tech Stack
**Frontend**: HTML5, CSS3, JavaScript, Chart.js, jsPDF + autotable  
**Backend**: Node.js, Express.js, SQLite3, body-parser, cors  

---

## 🚀 Setup & Run (Step-by-Step)

### 1️⃣ Clone repository
```bash
git clone https://github.com/M2vtcne/bhc-library-system.git
cd bhc-library-system
2️⃣ Install backend dependencies
bash
Copy code
npm install express sqlite3 body-parser cors
# optional (for auto-restart during dev)
npm install --save-dev nodemon
3️⃣ Start backend server
bash
Copy code
# plain node
node server.js

# or with nodemon
npx nodemon server.js
📡 The API runs at: http://localhost:3000/api

4️⃣ Serve frontend
Option A — Node http-server:

bash
Copy code
npm install -g http-server
http-server -c-1 . -p 8080
Option B — Python:

bash
Copy code
python -m http.server 8080
5️⃣ Open in browser
Login module → http://localhost:8080/index.html

Admin dashboard → http://localhost:8080/dashboard.html

Borrower portal → http://localhost:8080/borrow.html