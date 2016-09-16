(function () {
    angular.module(appConfig.appName).directive('mainScreen', ['$timeout', 'StreamsStateManager', function ($timeout, StreamsStateManager) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'streamviewer/templates/main-screen.html',
            controller: function($scope){
                $scope.activeStream = '';
                $scope.previewStream = '';
                $scope.allStreamsShown = false;
            },
            link: function (scope, elem, attrs) {

                scope.$watchCollection(function () { return StreamsStateManager.streams[0] }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        updatePlayer(0);
                    }
                });
                scope.$watchCollection(function () { return StreamsStateManager.streams[1] }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        updatePlayer(1);
                    }
                });
                scope.$watchCollection(function () { return StreamsStateManager.streams[2] }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        updatePlayer(2);
                    }
                });
                scope.$watchCollection(function () { return StreamsStateManager.streams[3] }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        updatePlayer(3);
                    }
                });

                function updatePlayer(id) {
                    var querySelector = StreamsStateManager.playerMode === 'twitch' ? 'iframe' : 'video';
                    if (StreamsStateManager.streams[id].status === 'active') {
                        var videoContainer = elem[0].getElementsByClassName('active')[0];
                        if (videoContainer.querySelector(querySelector)) videoContainer.removeChild(videoContainer.querySelector(querySelector));
                        videoContainer.insertBefore(StreamsStateManager.streams[id].player, videoContainer.childNodes[0]);
                    }
                    if (StreamsStateManager.streams[id].status === 'preview') {
                        var videoContainer = elem[0].getElementsByClassName('preview')[0];
                        if (videoContainer.querySelector(querySelector)) videoContainer.removeChild(videoContainer.querySelector(querySelector));
                        videoContainer.insertBefore(StreamsStateManager.streams[id].player, videoContainer.childNodes[0]);
                    }

                    scope.activeStream = '';
                    scope.previewStream = '';
                    for (var i = 0; i < 4; i++) {
                        if (StreamsStateManager.streams[i].status === 'active') {
                            scope.activeStream = i;
                        }
                        if (StreamsStateManager.streams[i].status === 'preview') {
                            scope.previewStream = i;
                        }
                    }
                    $timeout(function () {
                        adjustStreams();
                    }, 50);
                }
                //scope.$watch(function () { return StreamsStateManager.streams[1] }, function (newValue, oldValue) {
                //    if (newValue !== oldValue) {
                //        console.log(2, newValue);
                //    }
                //}, true);
                //scope.$watch(function () { return StreamsStateManager.streams[2] }, function (newValue, oldValue) {
                //    if (newValue !== oldValue) {
                //        console.log(3, newValue);
                //    }
                //}, true);
                //scope.$watch(function () { return StreamsStateManager.streams[3] }, function (newValue, oldValue) {
                //    if (newValue !== oldValue) {
                //        console.log(4, newValue);
                //    }
                //}, true);


                //scope.$watch(function () { return JSON.stringify(StreamsStateManager.streams) }, function (newValue, oldValue) {
                //    if (newValue !== oldValue) {
                //        if (!StreamsStateManager.allStreamsShown) {
                //            scope.allStreamsShown = false;
                //            for (var i = 0; i < 4; i++) {
                //                var videoContainer = elem[0].querySelector('#allStreams' + i);
                //                if (videoContainer.querySelector('iframe')) videoContainer.removeChild(videoContainer.querySelector('iframe'));
                //            }

                //            var newActive = '';
                //            var newPreview = '';
                //            for (var i = 0; i < 4; i++) {
                //                if (StreamsStateManager.streams[i].status === 'active') {
                //                    newActive = i;
                //                }
                //                if (StreamsStateManager.streams[i].status === 'preview') {
                //                    newPreview = i;
                //                }
                //            }

                //            scope.activeStream = '';
                //            scope.previewStream = '';
                //            for (var i = 0; i < 4; i++) {
                //                if (StreamsStateManager.streams[i].status === 'active') {
                //                    var videoContainer = elem[0].getElementsByClassName('active')[0];
                //                    if (videoContainer.querySelector('iframe')) videoContainer.removeChild(videoContainer.querySelector('iframe'));
                //                    videoContainer.insertBefore(StreamsStateManager.streams[i].player, videoContainer.childNodes[0]);
                //                    scope.activeStream = i;
                //                    adjustStreams();
                //                }
                //                if (StreamsStateManager.streams[i].status === 'preview') {
                //                    var videoContainer = elem[0].getElementsByClassName('preview')[0];
                //                    if (videoContainer.querySelector('iframe')) videoContainer.removeChild(videoContainer.querySelector('iframe'));
                //                    videoContainer.insertBefore(StreamsStateManager.streams[i].player, videoContainer.childNodes[0]);
                //                    scope.previewStream = i;
                //                    adjustStreams();
                //                }
                //            }
                //        } else {
                //            scope.allStreamsShown = true;
                //            console.log('allStreamsShown', newValue);
                //            for (var i = 0; i < 4; i++) {
                //                var videoContainer = elem[0].querySelector('#allStreams' + i);
                //                if (videoContainer.querySelector('iframe')) videoContainer.removeChild(videoContainer.querySelector('iframe'));
                //                if (StreamsStateManager.streams[i].player) videoContainer.insertBefore(StreamsStateManager.streams[i].player, videoContainer.childNodes[0]);
                //            }
                //        }
                        
                //    }
                //});

                scope.$watch(function () { return StreamsStateManager.showStreamOverviewList }, function (newValue, oldValue) {
                    $timeout(function () {
                        adjustStreams();
                    },50);
                });

                scope.$watch(function () { return StreamsStateManager.showChat }, function (newValue, oldValue) {
                    $timeout(function () {
                        adjustStreams();
                    }, 50);
                });

                window.addEventListener("resize", adjustStreams);

                function adjustStreams() {
                    var activeStreamElem = elem[0].getElementsByClassName('active')[0];
                    var previewStreamElem = elem[0].getElementsByClassName('preview')[0];
                    var ratio = 16 / 9;

                    if (activeStreamElem.innerHTML !== '' && previewStreamElem.innerHTML !== '') {
                        var screenWidth = elem[0].offsetWidth;
                        var screenHeight = elem[0].offsetHeight;
                        var videoWidth = 0;
                        var videoHeight = 0;

                        if (screenWidth >= 2 * screenHeight * ratio) {
                            videoHeight = screenHeight;
                            videoWidth = screenHeight * ratio;
                        }

                        if (screenHeight * ratio > screenWidth / 2 && screenHeight * ratio < screenWidth) {
                            videoWidth = screenWidth * (0.5 + 0.1 * ((screenHeight * ratio * 2 - screenWidth) / (screenHeight * ratio)));
                            videoHeight = videoWidth / ratio;
                        }

                        if (screenHeight * ratio > screenWidth) {
                            videoWidth = screenWidth * (0.5 - 0.3 + 0.4 * (1 / (screenWidth / (screenHeight * ratio))));
                            videoHeight = videoWidth / ratio;
                        }

                        if (screenHeight >= 2 * screenWidth / ratio) {
                            videoWidth = screenWidth;
                            videoHeight = screenWidth / ratio;
                        }

                        activeStreamElem.style.width = videoWidth + 'px';
                        activeStreamElem.style.height = videoHeight + 'px';

                        previewStreamElem.style.width = videoWidth + 'px';
                        previewStreamElem.style.height = videoHeight + 'px';
                    } else {
                        if (activeStreamElem.innerHTML) {
                            activeStreamElem.style.removeProperty('width');
                            activeStreamElem.style.removeProperty('height');
                        }
                        if (previewStreamElem.innerHTML) {
                            previewStreamElem.style.removeProperty('width');
                            previewStreamElem.style.removeProperty('height');
                        }
                    }
                }
            }
        };
    }]);
})();