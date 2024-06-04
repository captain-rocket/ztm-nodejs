const friends = require('../models/friends.model');
const log = require('./color.logs.controller');

const path = require('path');

function getMessages(req, res) {
  // res.sendFile(path.join(__dirname, '..', 'public', 'images', 'skimountain.jpg'));
  res.render('messages', {
    title: 'Messages',
    friend: 'Elon Musk',
  });
}

function postMessage(req, res) {
  console.log(log.color.yellow('Updating messages...'));
}

module.exports = {
  getMessages,
  postMessage,
};
