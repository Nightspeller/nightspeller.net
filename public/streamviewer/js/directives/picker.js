(function () {
    angular.module(appConfig.appName).directive('picker', ['PickerService', function (PickerService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'streamviewer/templates/picker.html',
            controller: function ($scope) {

                $scope.PickerService = PickerService;

                $scope.hidePicker = function () {
                    PickerService.resetState();
                    $scope.gameSearchInput = '';
                    $scope.streamerSearchInput = '';
                };

                $scope.cardClicked = function (card) {
                    PickerService.setCurrentState(card.nextState);
                    $scope.gameSearchInput = '';
                    $scope.streamerSearchInput = '';
                };

                $scope.back = function () {
                    PickerService.returnToPrevState();
                };

                $scope.prevPage = function () {
                    PickerService.prevPage();
                };

                $scope.nextPage = function () {
                    PickerService.nextPage();
                };

                $scope.gameSearch = function () {
                    PickerService.search($scope.gameSearchInput, 'game');
                };

                $scope.streamerSearch = function () {
                    PickerService.search($scope.streamerSearchInput, 'streamer');
                };

            }
        };
    }]);
})();