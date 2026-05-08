const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authenticateToken = require('../middlewares/auth');

// Semua endpoint Todo (butuh token login)
router.post('/todo', authenticateToken, todoController.createTodo);
router.get('/todo', authenticateToken, todoController.getAllTodos);
router.get('/edittodo/:id', authenticateToken, todoController.getTodoById);
router.put('/todo/:id', authenticateToken, todoController.updateTodo);
router.delete('/todo/:id', authenticateToken, todoController.deleteTodo);

module.exports = router;
