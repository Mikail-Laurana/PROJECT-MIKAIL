const express = require('express');
const app = express();
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/foto', express.static(path.join(__dirname, 'public/foto')));

<<<<<<< HEAD
app.use('/user', userRoutes);
app.use('/todo', todoRoutes);
=======
app.use(userRoutes);
app.use(todoRoutes);
>>>>>>> 6e163c09643a916e17b5897e8d825eb068b0df20
app.use(express.static(path.join(__dirname, 'public')));



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

