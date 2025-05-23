// server.js
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();

// Config
app.use(express.static('public'));
app.use('/admin', express.static('admin'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Fake user for login (you'll hash the password in real)
const USER = {
  username: 'admin',
  password: '$2b$10$hashedpasswordhere' // hash using bcrypt.hash
};

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && await bcrypt.compare(password, USER.password)) {
    req.session.user = username;
    return res.redirect('/admin/dashboard.html');
  }
  res.status(401).send('Unauthorized');
});

// Upload route
app.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.session.user) return res.status(403).send('Forbidden');
  // Save file info to DB or file
  res.redirect('/admin/dashboard.html');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
