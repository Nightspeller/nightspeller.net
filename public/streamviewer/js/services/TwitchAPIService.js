(function () {
    angular.module(appConfig.appName).service('TwitchAPIService', ['$q', function ($q) {

        this.prepareChannel = function (channelId, channelName) {
            if (channelName) {
                return $q(function (resolve, reject) {
                    WinJS.xhr({
                        url: 'http://api.twitch.tv/api/channels/' + channelName + '/access_token?&client_id=aoj81mhxdidmwxqw05lm73wt7s2p3sg',
                        responseType: "json"
                    }).done(function completed(result) {
                        var response = result.response;
                        var url = 'http://usher.justin.tv/api/channel/hls/' + channelName + '.m3u8?token=' + response.token + '&sig=' + response.sig + '&allow_audio_only=true&allow_source=true&type=any';
                        resolve(url);
                    });
                })
            };
        };

        this.getGames = function (amount, page) {
            return sendRequest("https://api.twitch.tv/kraken/games/top?limit=" + amount + "&client_id=aoj81mhxdidmwxqw05lm73wt7s2p3sg&offset=" + page * amount);
        };

        this.getStreamsForGame = function (amount, page, game) {
            return sendRequest("https://api.twitch.tv/kraken/streams?game=" + game + "&client_id=aoj81mhxdidmwxqw05lm73wt7s2p3sg&limit=" + amount + "&offset=" + page * amount);
        };

        this.searchForGame = function (query) {
            return sendRequest('https://api.twitch.tv/kraken/search/games?q=' + query + '&type=suggest&client_id=aoj81mhxdidmwxqw05lm73wt7s2p3sg');
        };

        this.searchForStreamer = function (query) {
            return sendRequest('https://api.twitch.tv/kraken/search/streams?q=' + query + '&client_id=aoj81mhxdidmwxqw05lm73wt7s2p3sg');
        };

        function sendRequest(url) {
            return $q(function (resolve, reject) {
                WinJS.xhr({
                    url: url
                }).done(function completed(data) {
                    data = JSON.parse(data.response);
                    resolve(data);
                });
            });
        }

    }]);
})();