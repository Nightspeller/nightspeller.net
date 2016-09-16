(function () {
    angular.module(appConfig.appName).service('PickerService', ['StreamsStateManager', 'TwitchAPIService', function (StreamsStateManager, TwitchAPIService) {

        this.statesStack = ['sources'];
        this.pickingFor = null;
        this.showPicker = false;
        this.page = 0;
        this.content = [];
        this.searchQuery = '';

        this.setCurrentState = function (state) {
            this.statesStack.push(state);
            this.page = 0;
            this.generateContentForState(state);
        };

        this.returnToPrevState = function () {
            this.statesStack.pop();
            this.page = 0;
            this.generateContentForState(this.statesStack[this.statesStack.length - 1]);
        };

        this.resetState = function () {
            this.statesStack = ['sources'];
            this.generateContentForState('sources');
            this.pickingFor = null;
            this.showPicker = false;
            this.page = 0;
        };

        this.pickStreamFor = function (id) {
            this.resetState();
            this.pickingFor = id;
            this.showPicker = true;
        };

        this.prevPage = function () {
            if (this.page !== 0) {
                this.page--;
                this.generateContentForState(this.statesStack[this.statesStack.length - 1]);
            }
        };

        this.nextPage = function () {
            this.page++;
            this.generateContentForState(this.statesStack[this.statesStack.length - 1]);
        };

        this.search = function (query, type) {
            if (query !== '') {
                this.searchQuery = query;
                console.log(type)
                type === 'game' ? this.generateContentForState('searchForGame') : this.generateContentForState('searchForStreamer');
            } else {
                this.generateContentForState('sources');
            }
        }

        this.generateContentForState = function (state) {
            var self = this;
            if (state === 'sources') {
                self.content = [
                    {
                        title: 'Twitch.tv',
                        description: 'Biggest gaming service',
                        img: 'streamviewer/images/logo_twitch.jpg',
                        nextState: 'twitchGames'
                    }//,{
                    //    title: 'Cybergame.tv',
                    //    description: 'Russian gaming service',
                    //    img: 'images/logo_cybergame.jpg',
                    //    nextState: {state: 'pickingDone'}
                    //},{
                    //    title: 'Goodgame.tv',
                    //    description: 'Goodgame sucks',
                    //    img: 'images/logo_goodgame.png',
                    //    nextState: {state: 'pickingDone'}
                    //}
                ];
            }

            if (state === 'twitchGames') {
                TwitchAPIService.getGames(12, this.page).then(function (data) {
                    var tempContent = [];
                    for (var i = 0; i < data.top.length; i++) {
                        var game = {};
                        game.title = data.top[i].game.name;
                        game.description = data.top[i].viewers + ' viewers';
                        game.img = data.top[i].game.box.medium;
                        game.nextState = { state: 'twitchGame', game: data.top[i].game.name };
                        tempContent.push(game);
                    }
                    self.content = tempContent;
                });
            }

            if (state.state === 'twitchGame') {
                TwitchAPIService.getStreamsForGame(12, this.page, state.game).then(function (data) {
                    var tempContent = [];
                    for (var i = 0; i < data.streams.length; i++) {
                        var stream = {};
                        stream.title = data.streams[i].channel.status;
                        stream.description = data.streams[i].channel.name + ': ' + data.streams[i].viewers + ' viewers';
                        stream.img = data.streams[i].preview.medium;
                        data.streams[i].channel.viewers = data.streams[i].viewers;
                        stream.nextState = { state: 'pickingDone', channel: data.streams[i].channel };
                        tempContent.push(stream);
                    }
                    self.content = tempContent;
                });
            }

            if (state === 'searchForGame') {
                TwitchAPIService.searchForGame(this.searchQuery).then(function (data) {
                    var tempContent = [];
                    for (var i = 0; i < data.games.length; i++) {
                        var game = {};
                        game.title = data.games[i].name;
                        game.description = data.games[i].popularity + ' viewers';
                        game.img = data.games[i].logo.medium;
                        game.nextState = { state: 'twitchGame', game: data.games[i].name };
                        tempContent.push(game);
                    }
                    self.content = tempContent;
                });
            }

            if (state === 'searchForStreamer') {
                TwitchAPIService.searchForStreamer(this.searchQuery).then(function (data) {
                    var tempContent = [];
                    for (var i = 0; i < data.streams.length; i++) {
                        var stream = {};
                        stream.title = data.streams[i].channel.status;
                        stream.description = data.streams[i].channel.name + ': ' + data.streams[i].viewers + ' viewers';
                        stream.img = data.streams[i].preview.medium;
                        data.streams[i].channel.viewers = data.streams[i].viewers;
                        stream.nextState = { state: 'pickingDone', channel: data.streams[i].channel };
                        tempContent.push(stream);
                    }
                    self.content = tempContent;
                });
            }

            if (state.state === 'pickingDone') {
                StreamsStateManager.updateStream(this.pickingFor, state.channel.name, state.channel);
                this.resetState();
            }
        }
    }]);
})();