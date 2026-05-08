const { Book } = require('../models'); // pastikan Book sesuai nama model Sequelize kamu
const { Op } = require('sequelize');

// GET /books - Menampilkan semua data buku
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data buku' });
  }
};

// POST /books - Menambahkan buku baru
exports.addBook = async (req, res) => {
  try {
    const { title, author, published_year, borrowed_name, is_returned, borrowed_date, returned_date } = req.body;
    const newBook = await Book.create({
      title,
      author,
      published_year,
      borrowed_name,
      is_returned,
      borrowed_date,
      returned_date,
    });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambahkan buku' });
  }
};

// PUT /books/:id - Update data buku berdasarkan ID
exports.updateBook = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await Book.update(req.body, { where: { id } });
    if (updated[0] === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    res.json({ message: 'Buku berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui buku' });
  }
};

// DELETE /books/:id - Hapus buku berdasarkan ID
exports.deleteBook = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Book.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    res.json({ message: 'Buku berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus buku' });
  }
};

// GET /books/search?title=... - Cari buku berdasarkan querystring
exports.searchBook = async (req, res) => {
  try {
    const { title, author } = req.query;

    const whereClause = {};
    if (title) {
      whereClause.title = { [Op.iLike]: `%${title}%` }; // iLike = case-insensitive
    }
    if (author) {
      whereClause.author = { [Op.iLike]: `%${author}%` };
    }

    const books = await Book.findAll({ where: whereClause });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mencari buku' });
  }
};
