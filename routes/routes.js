var express = require('express');
var router = express.Router();

router.use(require('./../middleware/htmlCheck'));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/resume', function(req, res, next) {
    res.render('resume', { title: 'Express' });
});

router.get('/portfolio', function(req, res, next) {
    res.render('portfolio', { title: 'Express' });
});

router.get('/streams', function(req, res, next) {
    res.redirect('http://streams.nightspeller.net');
});

router.get('/twitch-login', function(req, res, next) {
    res.render('twitch-login', { title: 'Express' });
});

module.exports = router;
