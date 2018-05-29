const appConfig = require('../config.js');
const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: appConfig.app.title,
    jsProdFile: appConfig.jsProdFile,
    cssProdFile: appConfig.cssProdFile,
  });
});

module.exports = router;
