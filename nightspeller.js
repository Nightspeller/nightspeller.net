var express = require('express');
var app = express();
var favicon = require('serve-favicon');

app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.use(express.static('public', {
    extensions: ['html']
}));

app.listen(3001, function () {
    console.log('Nightspeller is listening on port 3001')
});