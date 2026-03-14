const express = require('express');
const router = express.Router();

let pool;

function initializeRouter(dbPool) {
    pool = dbPool;
    return router;
}

// Data sum display on mainpage
router.get('/data', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM businesses LIMIT 100');
        res.json({ businesses: rows });
    } catch (error) {
        console.error('Database error:', error);

        res.status(500).json({
            error: 'Database query failed',
            details: error.message
        });
    }
});

// Main Search endpoint
router.get('/search', async (req, res) => {
    try {
        const {
            name = '',
            address = '',
            category = '',
            price_range = '',
            rating = '',
            limit = '60',
            offset = '0',
        } = req.query;

        let sql = `
            SELECT
                id, name, address, latitude, longitude, category,
                opening_hours, average_rating, price_range,
                ai_description, source_urls, last_updated
            FROM businesses
            WHERE 1=1`;

        // Safe query insertion
        const params = []
        if (name) {
            sql += `AND (name LIKE ? OR ai_description LIKE ? OR address LIKE ?)`;

            const searchTerm = `%${name}%`;
            params.push(searchTerm, searchTerm, searchTerm)
        }
        if (category) {
            sql += `AND category = ?`;
            params.push(category);
        }
        if (price_range) {
            sql += `AND price_range = ?`;
            params.push(price_range);
        }
        if (address) {
            sql += `AND address LIKE ?`;
            params.push(`%${address}%`);
        }
        if (rating) {
            sql += ` AND average_rating >= ?`;
            params.push(parseFloat(rating));
        }

        sql += `ORDER BY average_rating DESC, name ASC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [businesses] = await pool.query(sql, params);
        let countSql = `SELECT COUNT(*) as total FROM businesses WHERE 1=1`;
        const countParams = [];

        // Query checking on count query
        if (name) {
            countSql += ` AND (name LIKE ? OR ai_description LIKE ? OR address LIKE ?)`;
            const searchTerm = `%${name}%`;
            countParams.push(searchTerm, searchTerm, searchTerm);
        }
        if (category) {
            countSql += `AND category =?`;
            countParams.push(category);
        }
        if (price_range) {
            countSql += `AND price_range =?`;
            countParams.push(price_range);
        }
        if (address) {
            countSql += `AND address LIKE ?`;
            countParams.push(`%${address}%`);
        }
        if (rating) {
            countSql += `AND average_rating >= ?`;
            countParams.push(parseFloat(rating));
        }

        const [countResult] = await pool.query(countSql, countParams);
        const total = countResult[0].total;

        res.json({
            businesses,
            meta: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                //TODO: implement limit filter + pagination 
                hasMore: (parseInt(offset) + businesses.length) < total
            }
        });

        // error catching
    } catch (error) {
        console.error('Search error:', error);

        res.status(500).json({
            error: 'Search failed',
            details: error.message
        });
    }
});

// Further routes go HERE c:

module.exports = { initializeRouter };