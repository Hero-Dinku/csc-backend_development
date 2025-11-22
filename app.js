const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// View engine
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');

// Routes
app.use('/', require('./routes/index'));
app.use('/inv', require('./routes/inventory'));

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
