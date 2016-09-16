(function () {
    angular.module(appConfig.appName).directive('chat', ['ChatService', function (ChatService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'streamviewer/templates/chat.html',
            controller: function ($scope) {
                $scope.ChatService = ChatService;
            },
            link: function (scope, elem, attrs) {

                for (var i = 0; i < 4; i++) {
                    var chatWebView = document.createElement('div');
                    chatWebView.id = 'chatContainer'+i;
                    elem[0].getElementsByClassName("chatContainers")[0].appendChild(chatWebView);
                }

                scope.$watch('ChatService.channels', function (newValue, oldValue) {
                    for (var i = 0; i < 4; i++) {
                        if (newValue[i] !== oldValue[i]) {
                            elem[0].querySelector("#chatContainer" + i).innerHTML = '<iframe src="https://www.twitch.tv/'+ newValue[i] +'/chat"></iframe>';
                        }
                    }
                }, true);

                scope.$watch('ChatService.activeChannelId', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        scope.showChat(newValue);
                    }
                }, true);

                scope.showChat = function(chatId) {
                    for (var i = 0; i < 4; i++) {
                        elem[0].querySelector("#chatContainer" + i).style.display = 'none';
                    }
                    elem[0].querySelector("#chatContainer" + chatId).style.display = 'flex';
                }
            }
        };
    }]);
})();