// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
	"use strict";

	var app = WinJS.Application;
	//var activation = Windows.ApplicationModel.Activation;

    angular.module(appConfig.appName, appConfig.dependancies).config(['$compileProvider', '$sceProvider', function ($compileProvider, $sceProvider) {

        //TODO: find better way to pass video to directive
        $sceProvider.enabled(false);

	    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);
	}]).filter('trusted', ['$sce', function ($sce) {
	    return function (url) {
	        return $sce.trustAsResourceUrl(url);
	    };
	}]);

	app.onactivated = function (args) {

	    angular.bootstrap(document, [appConfig.appName]);

		if (false && args.detail.kind === activation.ActivationKind.launch) {
			if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
			    // TODO: This application has been newly launched. Initialize your application here.

			    var src = 'http://usher.justin.tv/api/channel/hls/riotgames.m3u8?token={"user_id":null,"channel":"riotgames","expires":1449901247,"chansub":{"view_until":1924905600,"restricted_bitrates":[]},"private":{"allowed_to_view":true},"privileged":false,"source_restricted":false}&sig=2228c748d080ad01413ced65a3684f1966e85b3a';

			    //setTimeout(function () {
			    //    var mediaPlayerElement = document.querySelector("[data-win-control='PlayerFramework.MediaPlayer']");
			    //    var mediaPlayer = mediaPlayerElement.winControl;
			    //    mediaPlayer.isSkipAheadVisible = false;
			    //    mediaPlayer.src = src;
			    //}, 3000)
			   


			} else {
				// TODO: This application was suspended and then terminated.
				// To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
			}
			args.setPromise(WinJS.UI.processAll());
		}
	};

	app.oncheckpoint = function (args) {
		// TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
		// You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
		// If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
	};

	app.start();
})();
