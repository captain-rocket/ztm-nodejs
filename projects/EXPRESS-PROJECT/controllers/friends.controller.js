const model = require('../models/friends.model');

function getFriends(req, res) {
  if (res.length) {
    res.status(200).json(model);
    // res.json(model);
  } else {
    res.status(404).json({
      error: 'You have no Friends 😔',
    });
  }
}
function getFriend(req, res) {
  const friendId = Number(req.params.friendId);
  const friend = model[friendId];
  if (model) {
    res.status(200).json(friend);
  } else {
    res.status(404).json({
      error: 'Friend does not exist',
    });
  }
}

function postFriend(req, res) {
  if (!req.body.user) {
    return res.status(400).json({
      error: 'Missing friend user',
    });
  }
  const newFriend = {
    id: model.length,
    user: req.body.user,
    message: req.body.message,
  };
  model.push(newFriend);
  res.json(newFriend);
}

module.exports = {
  getFriend,
  getFriends,
  postFriend,
};
