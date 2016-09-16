(function () {
    angular.module(appConfig.appName).directive('videoPlayer', ['$sce', '$timeout', function ($sce, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'streamviewer/templates/video-player.html',
            scope: true,
            controller: function ($scope) {
                $scope.playing = true;
                $scope.muted = false;
                $scope.fullscreened = false;
            },
            link: function ($scope, elem, attrs) {

                
                var volumeBar = elem.find("input");

                $scope.play = function () {
                    var videoPlayer = elem[0].getElementsByTagName('video')[0];
                    videoPlayer.play();
                    $scope.playing = true;
                }

                $scope.pause = function () {
                    var videoPlayer = elem[0].getElementsByTagName('video')[0];
                    videoPlayer.pause();
                    $scope.playing = false; 
                }

                $scope.mute = function () {
                    var videoPlayer = elem[0].getElementsByTagName('video')[0];
                    videoPlayer.muted = true;
                    $scope.muted = true;
                }

                $scope.unmute = function () {
                    var videoPlayer = elem[0].getElementsByTagName('video')[0];
                    videoPlayer.muted = false;
                    $scope.muted = false;
                }

                $scope.fullscreen = function (value) {
                    if (value) {
                        elem[0].requestFullscreen();
                        $scope.fullscreened = true;
                    } else {
                        document.exitFullscreen();
                        $scope.fullscreened = false;
                    }
                }

                volumeBar.bind("change", function (value) {
                    var videoPlayer = elem[0].getElementsByTagName('video')[0];
                    videoPlayer.volume = volumeBar.val() / 100;
                })

                var timeoutKeeper;

                $scope.mouseEvent = function (show) {
                    var videoPlayer = elem[0].getElementsByTagName('video')[0];
                    if (videoPlayer) {
                        if (show) {
                            $scope.showControls = show;
                            $timeout.cancel(timeoutKeeper);
                        } else {
                            timeoutKeeper = $timeout(function () {
                                $scope.showControls = show;
                            }, 3000)
                        }
                    }
                }
            }
        };
    }]);
})();