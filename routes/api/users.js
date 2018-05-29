//2018-0428: place holder for fetch user info (offer & bid)
const express = require('express');

const router = express.Router();

// Import User model
const User = require('../../models/user');

// POST to find
router.post('/find', (req, res) => {
  // Get the requested user
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      return res.json({ error: err });
    }

    if (!user) {
      return res.json({ error: 'Username not found' });
    }

    const { username, albums, artists } = user;
    return res.json({ username, albums, artists });
  });
});

// GET user list
router.get('/list', (req, res, next) => {
  // Find all matching users
  User.find((err, users) => {
    if (err) {
      // if something is wrong, send an error
      return res.send(err);
    }
    // otherwise return array of users
    return res.json(users);
  });
});

module.exports = router;
