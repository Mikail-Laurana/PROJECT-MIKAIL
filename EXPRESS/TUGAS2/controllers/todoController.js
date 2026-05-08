const pool = require('../db');

module.exports = {
  // Menambahkan todo baru
  createTodo: async (req, res) => {
    const { kegiatan, status } = req.body;
    const userId = req.user.id;

    if (!kegiatan) {
      return res.status(400).json({ message: 'Kegiatan tidak boleh kosong' });
    }

    try {
    const result = await pool.query(
      'INSERT INTO "Todo" (kegiatan, status, "userId") VALUES ($1, $2, $3) RETURNING *',
      [kegiatan, status, userId]
    );
    res.status(201).json({ message: 'Todo berhasil ditambahkan', todo: result.rows[0] });
  } catch (error) {
    console.error('Error saat menambahkan todo:', error); // Tambahan log untuk debugging
    res.status(500).json({ error: 'Gagal membuat todo' });
  }
  },

  // Menampilkan semua todo dari semua user
  getAllTodos: async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT t.*, u.name FROM "Todo" t JOIN "User" u ON t."userId" = u.id'
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Gagal mengambil data todo' });
    }
  },

  // Menampilkan todo berdasarkan ID
  getTodoById: async (req, res) => {
    const todoId = req.params.id;
    try {
      const result = await pool.query('SELECT * FROM "Todo" WHERE id = $1', [todoId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Todo tidak ditemukan' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Gagal mengambil data todo' });
    }
  },

updateTodo: async (req, res) => {
  const todoId = req.params.id;
  const { kegiatan, status } = req.body;
  const userId = req.user.id; // dari token JWT

  try {
    // Cek apakah todo milik user
    const check = await pool.query('SELECT * FROM "Todo" WHERE id = $1', [todoId]);
    const todo = check.rows[0];

    if (!todo) {
      return res.status(404).json({ message: 'Todo tidak ditemukan' });
    }

    if (todo.userId !== userId) {
      return res.status(403).json({ message: 'Kamu tidak punya izin untuk mengedit todo ini' });
    }

    // Update data
    await pool.query(
      'UPDATE "Todo" SET kegiatan = $1, status = $2 WHERE id = $3',
      [kegiatan, status, todoId]
    );

        res.json({ message: 'Todo berhasil diperbarui' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal mengupdate todo' });
    }
},


  // Menghapus todo berdasarkan ID
  deleteTodo: async (req, res) => {
    const todoId = req.params.id;
    const userId = req.user.id;

    try {
      const check = await pool.query('SELECT * FROM "Todo" WHERE id = $1', [todoId]);
      const todo = check.rows[0];

      if (!todo) {
        return res.status(404).json({ message: 'Todo tidak ditemukan' });
      }

      if (todo.userId !== userId) {
        return res.status(403).json({ message: 'Tidak punya akses untuk hapus todo ini' });
      }

      await pool.query('DELETE FROM "Todo" WHERE id = $1', [todoId]);
      res.json({ message: 'Todo berhasil dihapus' });
    } catch (err) {
      res.status(500).json({ error: 'Gagal menghapus todo' });
    }
  }
};
