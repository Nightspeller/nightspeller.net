(function () {
    angular.module(appConfig.appName).service('StreamsStateManager', ['$timeout', '$rootScope', 'ChatService', 'TwitchAPIService', function ($timeout, $rootScope, ChatService, TwitchAPIService) {

        this.showStreamOverviewList = true;
        this.showChat = true;
        this.allStreamsShown = false;

        this.playerMode = 'twitch';

        this.streams = [{
            id: 0,
            channel: '',
            channelUrl: '',
            player: '',
            status: '',
            prevStatus: '',
            info: ''
        },{
            id: 1,
            channel: '',
            channelUrl: '',
            player: '',
            status: '',
            prevStatus: '',
            info: ''
        },{
            id: 2,
            channel: '',
            channelUrl: '',
            player: '',
            status: '',
            prevStatus: '',
            info: ''
        },{
            id: 3,
            channel: '',
            channelUrl: '',
            player: '',
            status: '',
            prevStatus: '',
            info: ''
        }];

        this.removeStream = function (id) {
            this.streams[id].channel = '';
            this.streams[id].channelUrl = '';
            this.streams[id].player.parentElement.removeChild(this.streams[id].player);
            this.streams[id].player = '';
            this.streams[id].status = '';
            this.streams[id].info = '';
        }

        this.refreshStream = function (id) {
            if (this.streams[id].channel) this.updateStream(id, this.streams[id].channel, this.streams[id].info);
        }

        this.setStreamStatus = function (channelId, status) {
            if (this.streams[channelId].channel !== '') {
                if (status === 'active') {
                    for (var i = 0; i < 4; i++) {
                        if (this.streams[i].status === 'active') this.streams[i].status = 'overview';
                    }
                    ChatService.setActiveChannel(channelId);
                }
                if (status === 'preview') {
                    for (var i = 0; i < 4; i++) {
                        if (this.streams[i].status === 'preview') this.streams[i].status = 'overview';
                    }
                }
                this.streams[channelId].status = status;
            }
        };

        this.updateStream = function (channelId, channelName, options) {
            if (this.playerMode === 'twitch') {
                var currentStatus = this.streams[channelId].status === '' ? 'overview' : this.streams[channelId].status;
                this.streams[channelId].channel = channelName;
                this.streams[channelId].channelUrl = 'https://player.twitch.tv/?channel=' + channelName;
                this.streams[channelId].player = this.buildPlayer('https://player.twitch.tv/?channel=' + channelName);
                this.streams[channelId].info = options;
                this.setStreamStatus(channelId, currentStatus);
                ChatService.updateChannels(channelId, channelName);
            } else {
                var self = this;
                TwitchAPIService.prepareChannel(channelId, channelName).then(function (channelUrl) {
                    var currentStatus = self.streams[channelId].status === '' ? 'overview' : self.streams[channelId].status;
                    self.streams[channelId].channel = channelName;
                    self.streams[channelId].channelUrl = channelUrl;
                    self.streams[channelId].player = self.buildPlayer(channelUrl);
                    self.streams[channelId].info = options;
                    self.setStreamStatus(channelId, currentStatus);
                });
                ChatService.updateChannels(channelId, channelName);
            }
        };

        this.swapActiveAndPreview = function () {
            if (!this.allStreamsShown) {
                var activeId = null;
                var previewId = null;
                for (var i = 0; i < 4; i++) {
                    if (this.streams[i].status === 'active') activeId = i;
                    if (this.streams[i].status === 'preview') previewId = i;
                }
                if (activeId !== null && previewId !== null) {
                    this.setStreamStatus(activeId, 'preview');
                    this.setStreamStatus(previewId, 'active');
                }
            }
        };

        this.showAllStreams = function () {
            if (this.allStreamsShown) {
                this.allStreamsShown = false;
                for (var i = 0; i < 4; i++) {
                    this.streams[i].status = this.streams[i].prevStatus;
                    this.streams[i].prevStatus = '';
                }
            } else {
                this.allStreamsShown = true;
                for (var i = 0; i < 4; i++) {
                    this.streams[i].prevStatus = this.streams[i].status;
                    this.streams[i].status = 'allShown';
                }
            }
        }

        this.buildPlayer = function (url) {
            if (this.playerMode === 'twitch') {
                var newPlayer = document.createElement('iframe');
                var src = document.createAttribute("src");
                src.value = url;
                newPlayer.setAttributeNode(src);
                return newPlayer;
            } else {
                var newPlayer = document.createElement('video');
                var src = document.createAttribute("src");
                src.value = url;
                newPlayer.setAttributeNode(src);
                var controls = document.createAttribute("controls");
                controls.value = "controls";
                newPlayer.setAttributeNode(controls);
                var autoplay = document.createAttribute("autoplay");
                autoplay.value = "false";
                newPlayer.setAttributeNode(autoplay);
                return newPlayer;
            }
           
        };
    }]);
})();

/* MS Player - PlayerFramework*/
//var newPlayer = document.createElement('div');

//var winControl = document.createAttribute("data-win-control");
//winControl.value = "PlayerFramework.MediaPlayer"
//newPlayer.setAttributeNode(winControl);

//var options = {
//    autoplay: true,
//    isTimelineVisible: false,
//    isTimelineEnabled: false,
//    isElapsedTimeEnabled: false,
//    isElapsedTimeVisible: false,
//    isRemainingTimeEnabled: false,
//    isRemainingTimeVisible: false,
//    width: '100%',
//    height: '100%',
//    src: url
//};

//var winOptions = document.createAttribute("data-win-options");
//winOptions.value = JSON.stringify(options);
//newPlayer.setAttributeNode(winOptions);
/////// this thing required when player inserted??
//WinJS.UI.processAll();


/* My Own Player Directive*/
//var newPlayer = document.createElement('video-player');
//var src = document.createAttribute("video-src");
//src.value = url
//newPlayer.setAttributeNode(src);
///////this thing needed upon insertion
//videoContainer.appendChild($compile(StreamsStateManager.streams[scope.num].player)(scope)[0]);
