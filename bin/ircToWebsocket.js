var irc = require('irc');
var WebSocketServer = require('ws').Server;

module.exports = function() {
    var wss = new WebSocketServer({ port: 8080 });

    wss.on('connection', function connection(ws) {
        var bot;
        var currentConnection;

        ws.on('message', function incoming(message) {
           // console.log('Client message: ', message);
            message = JSON.parse(message);
            if (message.auth) {
                currentConnection = message;
                if (bot) {
                    bot.removeAllListeners();
                    bot = '';
                }
                bot = new irc.Client('irc.twitch.tv', currentConnection.userName, {
                    userName: currentConnection.userName,
                    port: 6667,
                    debug: true,
                    channels: [currentConnection.channel],
                    sasl: true,
                    password: currentConnection.auth
                });
                bot.addListener('message'+message.channel, function(from, message) {
                //    console.log('Twitch message <' + from + '>' + message);
                    ws.send(JSON.stringify({author: from, text: message}));
                });
            } else {
                if ( bot && currentConnection) {
                    bot.say(currentConnection.channel, message.text);
                } else {
                    console.log('something went wrong!', bot, currentConnection);
                }
            }
        });

        ws.on('close', function incoming(message) {
         //   console.log('Closing: ', message);
            if (bot) {
                bot.removeAllListeners();
            } else {
                console.log('No bot on closing', bot);
            }
        });
    });
}

/*var bot = new irc.Client('irc.twitch.tv', 'serg_nightspeller', {
 userName: 'serg_nightspeller',
 port: 6667,
 debug: true,
 channels: ['#serg_nightspeller'],
 sasl: true,
 password: 'oauth:qqdwf9bhi2eat1soec7f928hzwq01k'
 });

 bot.addListener('error', function(message) {
 console.error('ERROR: %s: %s', message.command, message.args.join(' '));
 });

 bot.addListener('message#serg_nightspeller', function(from, message) {
 console.log('<%s> %s', from, message);
 });

 bot.addListener('pm', function(nick, message) {
 console.log('Got private message from %s: %s', nick, message);
 });
 bot.addListener('join', function(channel, who) {
 console.log('%s has joined %s', who, channel);
 });
 bot.addListener('part', function(channel, who, reason) {
 console.log('%s has left %s: %s', who, channel, reason);
 });
 bot.addListener('kick', function(channel, who, by, reason) {
 console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
 });*/




