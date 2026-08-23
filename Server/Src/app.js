const express = require('express');
const cors = require('cors');
const app = express();

const cookieParser = require('cookie-parser');
const serverRoutes = require('./routes/server.route');

app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1', serverRoutes);

app.get('/api/v1', (req, res) => {
    res.json({
        message: 'Welcome to the API',
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});

module.exports = app;
