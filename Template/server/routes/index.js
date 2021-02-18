const express = require('express');
const http = require('superagent');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const msg = await http.get('http://service_hello:3000/');
    const info = await http.get('http://service_info:3000/')
    res.render('index', { title: 'Express', message: msg.text, info: info.text });
  } catch (err) {
    console.error(err);
    res.render('index', { title: 'Express', message: 'Internal server error' });
  }
});
module.exports = router;
