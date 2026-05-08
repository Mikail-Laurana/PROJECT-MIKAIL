const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/auth');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './public/foto',
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  },
});
const upload = multer({ storage });

// Routes
<<<<<<< HEAD
router.post('/register', upload.single('foto'), userController.register);
router.post('/login', userController.login);
router.get('/', authenticateToken, userController.getProfile);
=======
router.post('/user/register', upload.single('foto'), userController.register);
router.post('/user/login', userController.login);
router.get('/user', authenticateToken, userController.getProfile);
>>>>>>> 6e163c09643a916e17b5897e8d825eb068b0df20

module.exports = router;
