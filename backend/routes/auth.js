const express = require('express');

const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = await User.findByUsername(username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// Register
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  
  const exists = await User.findByUsername(username);
  if (exists) return res.status(400).json({ error: 'Username already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await User.create({ username, password: hashedPassword, role });
  
  res.status(201).json({ message: 'User created', userId });
});

module.exports = router;