# 📚 BHC Library Borrowing Portal

A simple **Library Borrowing Management System** for students and admins.  
Students can log in with their Student ID and PIN to borrow books, while admins can manage the collection, borrowers, and track transactions.

Built with **HTML/CSS/Vanilla JS** on the frontend and **Node.js + Express + SQLite** on the backend.

---

## ✨ Features
- Admin dashboard: manage books (with cover images), borrowers, transactions, and admins.  
- Borrower portal: login with Student ID + PIN and borrow books.  
- CRUD API for books, borrowers, admins and transactions (SQLite backend).  
- Auto-seed sample Filipino books with cover images.  
- Export (CSV/PDF/JSON) - present in frontend (dashboard).  

---

## 🛠️ Tech Stack
**Frontend**: HTML5, CSS3, JavaScript, Chart.js, jsPDF + autotable  
**Backend**: Node.js, Express.js, SQLite3, body-parser, cors  

---

## 🚀 Setup & Run (Step-by-Step)

1. **Clone repository**
   ```bash
   git clone https://github.com/M2vtcne/bhc-library-system.git
   cd bhc-library-system
Install backend dependencies

bash
Copy code
npm install express sqlite3 body-parser cors
# optional (for auto-restart during dev)
npm install --save-dev nodemon
Start backend server

bash
Copy code
# plain node
node server.js

# or with nodemon
npx nodemon server.js
The API runs at: http://localhost:3000/api

Serve frontend
Option A — Node http-server:

bash
Copy code
npm install -g http-server
http-server -c-1 . -p 8080
Option B — Python:

bash
Copy code
python -m http.server 8080
Open in browser:

Login module -> http://localhost:8080/index.html

Admin dashboard → http://localhost:8080/dashboard.html

Borrower portal → http://localhost:8080/borrow.html
