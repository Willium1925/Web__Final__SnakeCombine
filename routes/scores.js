const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/scores.db');

// 取得積分榜（由高到低排序）
router.get('/', (req, res) => {
    db.all("SELECT * FROM scores ORDER BY score DESC LIMIT 10", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// 新增分數
router.post('/', (req, res) => {
    const score = req.body.score;
    if (typeof score !== 'number') {
        res.status(400).json({ error: 'Invalid score' });
        return;
    }
    db.run("INSERT INTO scores (score) VALUES (?)", [score], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

module.exports = router;
