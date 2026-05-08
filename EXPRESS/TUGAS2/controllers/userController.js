const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

module.exports = {
  register: async (req, res) => {
    const { name, email, password } = req.body;
    const foto = req.file?.filename;

    if (!email || !password || !name || !foto) {
      return res.status(400).json({ message: 'Lengkapi semua field!' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = `INSERT INTO "User" (name, email, password, foto) VALUES ($1, $2, $3, $4)`;
      await pool.query(query, [name, email, hashedPassword, foto]);

      res.status(201).json({ message: 'Sign Up, Success!' });
    } catch (error) {
      res.status(500).json({ error: 'Gagal register' });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await pool.query(`SELECT * FROM "User" WHERE email = $1`, [email]);
      const user = result.rows[0];

      if (!user) return res.status(404).json({ message: 'Email tidak terdaftar' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: 'Password salah' });

      const token = jwt.sign({ id: user.id, name: user.name },'rahasia');
      res.json({ message: 'Sign In, Success!', token });
    } catch (error) {
      res.status(500).json({ error: 'Gagal login' });
    }
  },

  getProfile: async (req, res) => {
    try {
      const result = await pool.query(`SELECT id, name, email, foto FROM "User" WHERE id = $1`, [req.user.id]);
      const user = result.rows[0];

      if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Gagal ambil data user' });
    }
  },
};
