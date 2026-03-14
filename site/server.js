const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path);')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 3306,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// Test database connection on startup
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    }).catch(error => {
        console.error('Database connection failed:', error.message);
    });

const { initializeRouter } = require('./routes/search.js');
const searchRoutes = initializeRouter(pool);

// Homepage route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server health route
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});



app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
