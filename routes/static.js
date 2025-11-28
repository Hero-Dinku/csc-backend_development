const express = require('express');
const router = express.Router();

// Home page route
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Home - CSE Motors',
        messages: res.locals.messages
    });
});

// About page route
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us - CSE Motors',
        messages: res.locals.messages
    });
});

// Contact page route
router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact Us - CSE Motors',
        messages: res.locals.messages
    });
});

module.exports = router;
