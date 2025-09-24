const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database("./library.db", (err) => {
  if (err) console.error("❌ DB error:", err);
  else console.log("✅ Connected to SQLite database.");
});

// Create tables kung wala pa
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    category TEXT,
    image TEXT,
    status TEXT DEFAULT 'Available'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS borrowers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId TEXT UNIQUE,
    name TEXT,
    course TEXT,
    pin TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId TEXT,
    bookId INTEGER,
    date TEXT,
    type TEXT
  )`);
});

// Seed sample books kung empty
db.get("SELECT COUNT(*) as count FROM books", (err, row) => {
  if (row.count === 0) {
const sampleBooks = [
  { 
    title: "Noli Me Tangere", 
    author: "José Rizal", 
    category: "Classic",
    // example image valid URL
    image: "https://covers.openlibrary.org/b/id/8231856-L.jpg"
  },
  { 
    title: "El Filibusterismo", 
    author: "José Rizal", 
    category: "Classic",
    image: "https://covers.openlibrary.org/b/id/10952756-L.jpg"
  },
  { 
    title: "Banaag at Sikat", 
    author: "Lope K. Santos", 
    category: "Novel",
    // use wikimedia public domain image
    image: "https://covers.openlibrary.org/b/id/13148632-L.jpg"
  },
  { 
    title: "Mga Ibong Mandaragit", 
    author: "Amado V. Hernandez", 
    category: "Novel",
    image: "https://covers.openlibrary.org/b/id/10959572-L.jpg"
  },
  { 
    title: "Dekada ’70", 
    author: "Lualhati Bautista", 
    category: "Historical",
    image: "https://covers.openlibrary.org/b/id/9254994-L.jpg"
  },
  { 
    title: "Bulaklak sa City Jail", 
    author: "Lualhati Bautista", 
    category: "Novel",
    // use Google Books front cover if available
    image: "https://books.google.com/books/content?id=hdzr0AEACAAJ&printsec=frontcover&img=1&zoom=1"
  }
];

    const stmt = db.prepare("INSERT INTO books (title, author, category, image) VALUES (?, ?, ?, ?)");
    sampleBooks.forEach(b => {
      stmt.run([b.title, b.author, b.category, b.image]);
    });
    stmt.finalize();
    console.log("📚 Sample books inserted!");
  }
});

// Routes
app.get("/", (req, res) => {
  res.send("📚 Library API is running...");
});

// ---------------------- BOOKS ----------------------
app.get("/api/books", (req, res) => {
  db.all("SELECT * FROM books", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/books", (req, res) => {
  const { title, author, category, image } = req.body;
  db.run(
    "INSERT INTO books (title, author, category, image) VALUES (?, ?, ?, ?)",
    [title, author, category, image],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, title, author, category, image });
    }
  );
});

app.put("/api/books/:id", (req, res) => {
  const { title, author, category, image, status } = req.body;
  db.run(
    "UPDATE books SET title=?, author=?, category=?, image=?, status=? WHERE id=?",
    [title, author, category, image, status || "Available", req.params.id],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ updated: this.changes });
    }
  );
});

app.delete("/api/books/:id", (req, res) => {
  db.run("DELETE FROM books WHERE id=?", [req.params.id], function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ deleted: this.changes });
  });
});

// ---------------------- BORROWERS ----------------------
app.get("/api/borrowers", (req, res) => {
  db.all("SELECT id, studentId, name, course FROM borrowers", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/borrowers", (req, res) => {
  const { studentId, name, course, pin } = req.body;
  db.run(
    "INSERT INTO borrowers (studentId, name, course, pin) VALUES (?, ?, ?, ?)",
    [studentId, name, course, pin],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, studentId, name, course });
    }
  );
});

app.post("/api/borrowers/login", (req, res) => {
  const { studentId, pin } = req.body;
  db.get("SELECT * FROM borrowers WHERE studentId = ? AND pin = ?", [studentId, pin], (err, row) => {
    if (err) res.status(500).json({ error: err.message });
    else if (!row) res.status(401).json({ error: "Invalid credentials" });
    else res.json({ message: "Login successful", borrower: row });
  });
});

// ---------------------- TRANSACTIONS ----------------------
app.get("/api/transactions", (req, res) => {
  db.all("SELECT * FROM transactions ORDER BY date DESC", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/borrow", (req, res) => {
  const { studentId, bookId } = req.body;
  const date = new Date().toISOString().split("T")[0];
  db.run(
    "INSERT INTO transactions (studentId, bookId, date, type) VALUES (?, ?, ?, ?)",
    [studentId, bookId, date, "Borrowed"],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else {
        db.run("UPDATE books SET status='Borrowed' WHERE id=?", [bookId]);
        res.json({ message: "Book borrowed successfully!" });
      }
    }
  );
});

app.post("/api/return", (req, res) => {
  const { studentId, bookId } = req.body;
  const date = new Date().toISOString().split("T")[0];
  db.run(
    "INSERT INTO transactions (studentId, bookId, date, type) VALUES (?, ?, ?, ?)",
    [studentId, bookId, date, "Returned"],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else {
        db.run("UPDATE books SET status='Available' WHERE id=?", [bookId]);
        res.json({ message: "Book returned successfully!" });
      }
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
