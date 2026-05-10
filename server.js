const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors()); 

let users = []; 
let tasks = [
  { id: 1, text: "Main Street Lighting Maintenance", status: "Completed" },
  { id: 2, text: "Emergency Water Pipe Repair", status: "In Progress" }
];

// 1. Register API
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Please fill in all fields!" });
  }
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "Username already exists!" });
  }
  users.push({ username, password });
  res.status(201).json({ message: "Account created successfully! Please login." });
});

// 2. Login API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password!" });
  }
  res.json({ message: "Login successful!", username: user.username });
});

// 3. Tasks APIs
app.get("/api/tasks", (req, res) => res.json(tasks));

app.post("/api/tasks", (req, res) => {
  const newTask = { id: Date.now(), text: req.body.text, status: "New" };
  tasks.unshift(newTask);
  res.json(newTask);
});

app.listen(5000, () => console.log("Server running..."));

// السطر الأهم لعمل السيرفر على Vercel
module.exports = app;