const express = require('express');
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/admin', express.static('admin'));
app.use('/uploads', express.static('uploads'));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Upload config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Fake login
const ADMIN = {
  username: 'admin',
  password: '$2b$10$QGBIzoqQ1KHZaTkfapfAVOKid1U5Bcl3A0JZ1trC6xzSvjUlrbOdq' // password: '1234'
};

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const valid = username === ADMIN.username && await bcrypt.compare(password, ADMIN.password);
  if (valid) {
    req.session.user = username;
    return res.redirect('/admin/dashboard.html');
  }
  res.status(401).send('Unauthorized');
});

// Upload route
app.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.session.user) return res.status(403).send('Not logged in');
  console.log('Uploaded:', req.file.filename);
  res.redirect('/admin/dashboard.html');
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
