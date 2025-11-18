const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'CSE Motors - Home'
    });
});

module.exports = router;
