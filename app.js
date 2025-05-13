'use strict';
const express = require('express');
const morgan = require('morgan');
const filmController = require('./controllers/filmController');

const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', filmController);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
