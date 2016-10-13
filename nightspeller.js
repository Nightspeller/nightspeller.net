var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var app = express();
var favicon = require('serve-favicon');

app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.use(express.static('public', {
    extensions: ['html']
}));

http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);

var options = {
   // pfx: fs.readFileSync('certs/httpsacme-v01.api.letsencrypt.org/nightspeller.net-all.pfx')
    pfx: fs.readFileSync('C:/Users/Administrator/AppData/Roaming/letsencrypt-win-simple/httpsacme-v01.api.letsencrypt.org/nightspeller.net-all.pfx')
};

https.createServer(options, app).listen(443, function () {
    console.log('Nightspeller is listening on port 443')
});