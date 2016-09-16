(function () {
    angular.module(appConfig.appName).controller('AppController', ['$scope', '$timeout', 'StreamsStateManager', function ($scope, $timeout, StreamsStateManager) {

        $scope.keyPressed = function ($event) {
            if ($event.keyCode === 96) {
                StreamsStateManager.showStreamOverviewList = !StreamsStateManager.showStreamOverviewList;
            }
                
                
            if ($event.keyCode === 92) {
                StreamsStateManager.showChat = !StreamsStateManager.showChat;
            }
        };

        $scope.StreamsStateManager = StreamsStateManager;
        //$scope.showWebView = false;
        //$scope.token = 'asdf';

        //var msWebview = document.getElementsByTagName('x-ms-webview')[0];
        //var webviewSrc = msWebview.src;

        //$timeout(function () {
        //    console.log('asdf', webviewSrc)
        //    if (webviewSrc.indexOf('access_token') === -1) {
        //        $scope.showWebView = true;
        //        $scope.token = msWebview.src;
        //        msWebview.addEventListener("mswebviewnavigationcompleted", function () {
        //            if (webviewSrc.indexOf('access_token') !== -1) {
        //                $scope.token = msWebview.src;
        //                $scope.showWebView = false;
        //            }
        //        });
        //    }
        //}, 5000);

        //$scope.loginButtonClicked = function () {
        //    $scope.token = msWebview.src;
        //};



    }]);
})();