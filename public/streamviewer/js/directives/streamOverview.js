(function () {
    angular.module(appConfig.appName).directive('streamOverview', ['StreamsStateManager', 'PickerService', 'TwitchAPIService', '$compile', function (StreamsStateManager, PickerService, TwitchAPIService, $compile) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'streamviewer/templates/stream-overview.html',
            scope: {
                show: '=',
                num: '='
            },
            controller: function ($scope, $element) {

                $scope.StreamsStateManager = StreamsStateManager;

                $scope.stream = StreamsStateManager.streams[$scope.num];

                $scope.add = function () {
                    PickerService.pickStreamFor($scope.num);
                };
                $scope.refresh = function () {
                    if ($scope.stream.channel) {
                        StreamsStateManager.refreshStream($scope.num);
                    }
                };
                $scope.remove = function () {
                    if ($scope.stream.channel) {
                        StreamsStateManager.removeStream($scope.num);
                    }
                };
                $scope.preview = function (event) {
                    if ($scope.stream.channel && !StreamsStateManager.allStreamsShown) {
                        if ($scope.stream.channel) {
                            if (StreamsStateManager.streams[$scope.num].status !== 'preview') {
                                StreamsStateManager.setStreamStatus($scope.num, 'preview');
                            } else {
                                StreamsStateManager.setStreamStatus($scope.num, 'overview');
                            }
                        }
                    }
                };
                $scope.moveToMain = function () {
                    if ($scope.stream.channel && !StreamsStateManager.allStreamsShown) {
                        if (StreamsStateManager.streams[$scope.num].status !== 'active') {
                            StreamsStateManager.setStreamStatus($scope.num, 'active');
                        } else {
                            StreamsStateManager.setStreamStatus($scope.num, 'overview');
                        }
                    }
                };
            },
            link: function (scope, elem, attrs) {
                scope.$watchCollection(function () { return StreamsStateManager.streams[scope.num] }, function (newValue, oldValue) {
                    if (newValue.status === 'overview') {
                        var querySelector = StreamsStateManager.playerMode === 'twitch' ? 'iframe' : 'video';
                        var videoContainer = elem[0].getElementsByClassName('streamOverviewVideo')[0];
                        if (videoContainer.querySelector(querySelector)) videoContainer.removeChild(videoContainer.querySelector(querySelector));
                        videoContainer.insertBefore(StreamsStateManager.streams[scope.num].player, videoContainer.childNodes[0]);
                    }
                });
            }
        };
    }]);
})();