const express = require('express');
const app = express();

app.use(express.json());

let database = [
  { id: 1, nama: 'Mikail', umur: 17 },
  { id: 2, nama: 'Ali', umur: 18 }
];

// GET - Ambil semua data
app.get('/users', (req, res) => {
  res.json(database);
});

// POST - Tambah user baru
app.post('/users', (req, res) => {
  const data = req.body;
  database.push(data);
  res.json({ pesan: 'User ditambahkan!', data });
});

// PUT - Ganti user (by ID)
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = database.findIndex(u => u.id === id);
  if (index !== -1) {
    database[index] = req.body;
    res.json({ pesan: 'User diubah!', data: database[index] });
  } else {
    res.status(404).json({ error: 'User tidak ditemukan' });
  }
});

// PATCH - Edit sebagian user
app.patch('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = database.find(u => u.id === id);
  if (user) {
    Object.assign(user, req.body);
    res.json({ pesan: 'User diperbarui sebagian', data: user });
  } else {
    res.status(404).json({ error: 'User tidak ditemukan' });
  }
});

// DELETE - Hapus user
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  database = database.filter(u => u.id !== id);
  res.json({ pesan: 'User dihapus', sisaData: database });
});

app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
