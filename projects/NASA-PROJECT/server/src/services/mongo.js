const mongoose = require('mongoose');

require('dotenv').config();

const log = require('../routes/color.logs.controller');

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
  console.log(log.decorate.bold('MongoDB connection ready'));
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  console.log('Mongoose connection state:', mongoose.connection.readyState);
  // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
  await mongoose.disconnect();
  console.log('Mongoose disconnected');
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
