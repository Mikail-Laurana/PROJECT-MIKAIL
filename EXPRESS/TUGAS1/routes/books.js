const express = require('express');
const router = express.Router();
const controller = require('../controllers/books');

// Tanpa '/books', karena nanti dipakai di app.js -> app.use('/books', bookRoutes)
router.get('/', controller.getAllBooks);
router.post('/', controller.addBook);
router.put('/:id', controller.updateBook);
router.delete('/:id', controller.deleteBook);
router.get('/search', controller.searchBook);

module.exports = router;
