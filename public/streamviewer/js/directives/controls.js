(function () {
    angular.module(appConfig.appName).directive('controls', ['StreamsStateManager', function (StreamsStateManager) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'streamviewer/templates/controls.html',
            controller: function ($scope) {
                $scope.showAllControls = false;

                $scope.StreamsStateManager = StreamsStateManager;

                $scope.fullscreenMode = false;

                $scope.showControls = function () {
                    $scope.showAllControls = !$scope.showAllControls;
                };

                $scope.toggleStreamList = function () {
                    StreamsStateManager.showStreamOverviewList = !StreamsStateManager.showStreamOverviewList;
                };

                $scope.toggleChat = function () {
                    StreamsStateManager.showChat = !StreamsStateManager.showChat;
                };

                $scope.toggleFullscreen = function () {
                    /*var applicationView = Windows.UI.ViewManagement.ApplicationView.getForCurrentView();
                    if (applicationView.isFullScreenMode) {
                        applicationView.exitFullScreenMode();
                        $scope.fullscreenMode = false;
                    } else {
                        applicationView.tryEnterFullScreenMode();
                        $scope.fullscreenMode = true;
                    }*/
                    var element = document.getElementsByTagName('body')[0];
                    //function toggleFullScreen() {
                        if (!$scope.fullscreenMode) {
                            if(element.requestFullscreen) {
                                element.requestFullscreen();
                            } else if(element.mozRequestFullScreen) {
                                element.mozRequestFullScreen();
                            } else if(element.webkitRequestFullscreen) {
                                element.webkitRequestFullscreen();
                            } else if(element.msRequestFullscreen) {
                                element.msRequestFullscreen();
                            }
                            $scope.fullscreenMode = true;
                        } else {
                            if(document.exitFullscreen) {
                                document.exitFullscreen();
                            } else if(document.mozCancelFullScreen) {
                                document.mozCancelFullScreen();
                            } else if(document.webkitExitFullscreen) {
                                document.webkitExitFullscreen();
                            }
                            $scope.fullscreenMode = false;
                        }
                    //}
                };
                
                $scope.swapMainAndPreview = function () {
                    StreamsStateManager.swapActiveAndPreview();
                };

                $scope.showAllStreams = function () {
                    alert('Feature is under development')
                    //var msgBox = new Windows.UI.Popups.MessageDialog('Feature is under development');
                    //msgBox.showAsync();
                    //StreamsStateManager.showAllStreams();
                };

                $scope.showAbout = function () {
                    alert('StreamViewer for Windows 10 by Serg Nigths. Feedback is welcomed: serj.nights@live.com');
                    //var msgBox = new Windows.UI.Popups.MessageDialog('StreamViewer for Windows 10 by Serg Nigths. Feedback is welcomed: serj.nights@live.com');
                    //msgBox.showAsync();
                }
            },
            link: function (scope, elem, attrs) {
               
            }
        };
    }]);
})();