const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const api = require('./routes/api');

const app = express();

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", 'unsafe-eval'],
//       // You can add other directives here as needed
//     },
//   }),
// );

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", 'https://localhost:8000', 'http://localhost:3000'],
//       styleSrc: ["'self'", 'https://localhost:8000'],
//       imgSrc: ["'self'", 'data:', 'https://localhost:8000'],
//       connectSrc: ["'self'", 'https://api.example.com'],
//     },
//   }),
// );

// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//   }),
// );
app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(`${path.join(__dirname, '../public')}`));
app.use('/v1', api);

app.get('/*', (req, res) => {
  res.sendFile(`${path.join(__dirname, '../public/index.html')}`);
});

module.exports = app;
