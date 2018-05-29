const appConfig = require('../../config.js');
const crypto = require('crypto');
const createDOMPurify = require('dompurify');
const express = require('express');
const { JSDOM } = require('jsdom');
const mongoose = require('mongoose');
const passport = require('passport');
const sendMail = require('../../sendmail');
const sequence = require('../../helpers/sequence');
const User = require('../../models/user.js');

const router = express.Router();

// configure mongoose promises
mongoose.Promise = global.Promise;

// GET to /checksession
router.get('/checksession', (req, res) => {
  if (req.user) {
    return res.send(JSON.stringify(req.user));
  }
  return res.send(JSON.stringify({}));
});

// GET to /logout
router.get('/logout', (req, res) => {
  req.logout();           // remove the req.uesr property & clear the login session
  req.session.destroy();
  return res.send(JSON.stringify(req.user));
});

// POST to /login
router.post('/login', async (req, res) => {
  // look up the user by their email
  const { credential } = req.body;
  const query = User.findOne({ $or: [{ email: credential }, { mobile: credential }] });
  const foundUser = await query.exec();

  if (foundUser && !foundUser.enabled) {
    return res.send(JSON.stringify({ error: 'Your account is suspended (1102)' }));
  }

  // if user exists, they will have a username, so add that to our body
  if (foundUser) { req.body.username = foundUser.username; }

  passport.authenticate('local')(req, res, () => {
    // If logged in, we will send back user info
    if (req.user) {
      return res.send(JSON.stringify(req.user));
    }

    // Otherwise return an error (this code should never run)
    return res.send(JSON.stringify({ error: 'There is an error logging in (1101)' }));
  });
});

// POST to /register
router.post('/register', async (req, res) => {
  // Check mobile phone number: must be integer & length= 11, 8, 10
  const { mobile } = req.body;
  const mLength = mobile.length;
  if (mobile !== parseInt(mobile, 0).toString()
    || (mLength !== 11 && mLength !== 8 && mLength !== 10)) {
    return res.send(JSON.stringify({ error: 'Mobile must be integer, either 11,8 or 10 digits long (1253)' }));
  }

  let query;
  let foundUser;

  // check and make sure the email doesn't already exist
  query = User.findOne({ email: req.body.email });
  foundUser = await query.exec();

  if (foundUser) {
    return res.send(JSON.stringify({ error: 'Email already exists, please contact admin@component.asia (1201)' }));
  }

  // check and make sure the email doesn't already exist
  query = User.findOne({ mobile: req.body.mobile });
  foundUser = await query.exec();

  if (foundUser) {
    return res.send(JSON.stringify({ error: 'Mobile already exists, please contact alex@component.asia (1201)' }));
  }

  // Create an user object to save, using values from incoming JSON
  if (!foundUser) {     //AT-Pending: no need to check !foundUser
    // sanitize data
    const { window } = (new JSDOM(''));
    const DOMPurify = createDOMPurify(window);
    const sanitizedBody = {
      nickname: DOMPurify.sanitize(req.body.nickname),
      password: req.body.password,
      company: {
        name: DOMPurify.sanitize(req.body.company),
        joinedAt: new Date().toISOString(),
      },
      wechat: DOMPurify.sanitize(req.body.wechat),
      email: DOMPurify.sanitize(req.body.email),
      mobile: DOMPurify.sanitize(req.body.mobile),
    };

    const newUser = new User(sanitizedBody);

    // const newUser = new User(req.body); // this is short form, same stuff

    // generate a hash ID for mongoose reference & passport
    newUser.username = Math.random().toString(36).substring(3);

    // Save, via Passport's "register" method, the user
    return User.register(newUser, req.body.password, (error) => {
      // If there is a problem, send back a JSON object with error detail
      if (error) {
        return res.send(JSON.stringify({ error: `${JSON.stringify(error.message)} (1202)` }));
      }

      // otherwise, log them in
      req.body.username = newUser.username;
      return passport.authenticate('local')(req, res, () => {
        // If logged in, we should habve user info to send back
        if (req.user) {
          return res.send(JSON.stringify(req.user));
        }
        // otherwise return an error
        return res.send(JSON.stringify({ error: 'User Registration Error (1203)' }));
      });
    });
  }

  // return an error if all else fails
  return res.send(JSON.stringify({ error: 'User Registration Error (1204)' }));
});

// POST to confirmPasswordReset
router.post('/confirmpasswordreset', async (req, res) => {
  let result;
  try {
    // look up user in the database, based on reset hash key AND passwordReset not expired
    const now = new Date().toISOString();
    const query = User.findOne({
      passwordReset: req.body.hash,
      passwordResetExpiredAt: { $gte: now },
    });

    const foundUser = await query.exec();

    // If the user exists, save their new password
    if (foundUser) {
      // user passport's built-in password set method
      foundUser.setPassword(req.body.password, (error) => {
        if (error) {
          result = res.send(JSON.stringify({ error: 'Seomthing went wrong, please contact system administrator (1301)' }));
        } else {
          // expire the passwordResetExpiredAt immediately & clear the hash
          foundUser.passwordResetExpiredAt = new Date().toISOString();
          foundUser.passwordReset = '';

          // once the password is set, save the user object
          foundUser.save((error2) => {
            if (error2) {
              result = res.send(JSON.stringify({ error: 'Seomthing went wrong, please contact system administrator (1302)' }));
            } else {
              result = res.send(JSON.stringify({ success: true }));
            }
          });
        }
      });
    } else {
      // if the reset-hash does not exist
      result = res.send(JSON.stringify({ error: 'Invalid Reset Link or it has expired, please request a new Password Reset email (1303)' }));
    }
  } catch (error) {
    result = res.send(JSON.stringify({ error: 'Seomthing went wrong, please contact system administrator (1304)' }));
  }
  return result;
});

// POST to requestPasswordReset
router.post('/requestpasswordreset', async (req, res) => {
  let result;
  try {
    // check and make sure the email exists
    const query = User.findOne({ email: req.body.email });
    const foundUser = await query.exec();

    // If the user exists, save their password hash
    const timeInMs = Date.now();
    const hashString = `${req.body.email}${timeInMs}`;
    const { secret } = appConfig.crypto;
    const hash = crypto.createHmac('sha256', secret)
      .update(hashString)
      .digest('hex');
    foundUser.passwordReset = hash;

    // create passwordResetExpiredAt (add 1 extra min)
    const expireInMs = new Date().getTime()
      + ((appConfig.auth.passwordResetValidInMins + 1) * 1000 * 60);

    foundUser.passwordResetExpiredAt = new Date(expireInMs).toISOString();

    foundUser.save((err) => {
      if (err) {
        result = res.send(JSON.stringify({ error: 'Password Reset Error, please contact system administrator (1401)' }));
      }

      // Put together the email
      sendMail.passwordReset(foundUser.email, foundUser.passwordReset, (error, messageId) => {
        if (error || !messageId) {
          result = res.send(JSON.stringify({ error: 'Password Reset Error, please contact system administrator (1402)' }));
        } else {
          result = res.send(JSON.stringify({ success: true }));
        }
      });
    });
  } catch (err) {
    // if the user does not exist, error out
    result = res.send(JSON.stringify({ error: 'Password Reset Error (1403)' }));
  }
  return result;
});

module.exports = router;
