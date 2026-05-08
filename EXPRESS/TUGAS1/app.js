const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const bookRoutes = require('./routes/books'); // path relatif

// Gunakan prefix /books
app.use('/books', bookRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
