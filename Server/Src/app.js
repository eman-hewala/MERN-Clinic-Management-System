const express = require('express');
const cors = require('cors');
const app = express();

const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/errorHandler.middleware');

const cookieParser = require('cookie-parser');
const serverRoutes = require('./routes/server.routes');

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', serverRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
