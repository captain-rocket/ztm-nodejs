const express = require('express');

const log = require('../controllers/color.logs.controller');

const friendsController = require('../controllers/friends.controller');

const friendsRouter = express.Router();

friendsRouter.use((req, res, next) => {
  console.log(log.bg.orange(log.decorate.bold('IP address:')), log.color.orange(req.ip));
  next();
});
friendsRouter.get('/', friendsController.getFriends);
friendsRouter.get('/:friendId', friendsController.getFriend);
friendsRouter.post('/', friendsController.postFriend);

module.exports = friendsRouter;
