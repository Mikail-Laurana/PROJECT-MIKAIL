const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todo_db', // atau nama database kamu
  password: '1234', // sesuai yang kamu buat saat install
  port: 5432
});

module.exports = pool;
