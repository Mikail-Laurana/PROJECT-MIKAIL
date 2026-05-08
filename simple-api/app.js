const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

// Endpoint GET semua data
app.get('/users', async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

// Endpoint POST data baru
app.post('/users', async (req, res) => {
  const { name } = req.body;
  const result = await pool.query('INSERT INTO users(name) VALUES($1) RETURNING *', [name]);
  res.json(result.rows[0]);
});

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
