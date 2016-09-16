(function () {
    angular.module(appConfig.appName).service('ChatService', [function () {
        var self = this;

        this.activeChannelId = '';

        this.channels = ['','','',''];

        this.setActiveChannel = function (channelId) {
            self.activeChannelId = channelId;
        }

        this.updateChannels = function (channelId, channelName) {
            self.channels[channelId] = channelName;
        };
    }]);
})();