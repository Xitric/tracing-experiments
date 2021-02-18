const express = require('express');
const http = require('superagent');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  http
    .get('http://service_hello:3000/')
    .then((msg) => {
      http
        .get('http://service_info:3000/')
        .then((info) => {
          res.render('index', { title: 'Express', message: msg.text, info: info.text });
        })
        .catch((err) => {
          console.error(err);
          res.render('index', { title: 'Express', message: 'Internal server error' });
        });
    })
    .catch((err) => {
      console.error(err);
      res.render('index', { title: 'Express', message: 'Internal server error' });
    });
});

module.exports = router;
