// Code goes here
(function() {
  
var myApp = angular.module('MyYoutubeApp', []);
myApp.constant('YT_event', {
	STOP:            0, 
	PLAY:            1,
	PAUSE:           2
});

myApp.run(function () {
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});


myApp.controller('YoutubeCtl', function($scope, YT_event) {

	var ctrl = this;

	var youtube = {
		player: null,
		playerId: "Youtube-Player",
		videoId: null
	};

	//initial settings
	$scope.playerStatus = "undefined"

	$scope.YT_event = YT_event;

	$scope.yt_target = null;

	$scope.yt_ready = false;

	ctrl.modal = {
		status: 'undefined',
		player: false
	};
	
	ctrl.getPlayer = function() {
		return this.modal.player;
	};
	ctrl.createPlayer = function($yt_target) { 
		//console.log('createPlayer', youtube);
		var player = new YT.Player(youtube.playerId, {
			height: '100%',
			width: '100%',
			videoId: youtube.videoId,
			playerVars: {
				autoplay: 0,
				html5: 1,
				theme: "light",
				modesbranding: 0,
				color: "white",
				iv_load_policy: 3,
				showinfo: 1,
				controls: 1
			}
		});
		return player;
	}

	$scope.addModal = function(modal) {
		ctrl.modal = modal;
		ctrl.modal.status = 'closed'
	}

	$scope.play = function(v) {
		//console.log(youtube);
		ctrl.modal.modal('show');
		if(v == youtube.yt_target)
			youtube.player.playVideo();
		else {
			youtube.player.loadVideoById(v);
			youtube.yt_target = v;
		}
		ctrl.modal.status = 'opened'
	}

	$scope.closeModal = function() {
		//console.log('closing');
		$scope.stopVideo();
		ctrl.modal.modal('hide');

	}
	$scope.stopVideo = function() {
		//console.log('stop videi');
		youtube.player.seekTo(0);
		youtube.player.stopVideo();
		$scope.yt_ready = false;

	}

	$scope.initPlayer = function($videoId) {
		youtube.player = ctrl.createPlayer();
		$scope.yt_ready = true;
	}

});

myApp.directive('youtubeModal', ['$window', '$compile', 'YT_event', function($window, $compile, YT_event) {


  return {
    restrict: "EA",

    link: function($scope, $el, attrs, $rootScope) {

    	var triggers, triggerClass, activate_trigger, player, modal, modalTpl, modalDims;

		modalDims = getModalDims();


		modalTpl = "<div class='modal fade youtube-modal' id='YoutubeModal' tabindex='-1' role='dialog' aria-labelledby='YoutubeModalModalLabel'>"+ 
			"<div class='modal-iframe' style='width:"+modalDims.width+"px; height: "+modalDims.height+"px; margin: 0 auto;'>"+
				"<div class='modal-iframe-content'>" +
					"<div class='responsive-embed'>" +
						"<div class='' id='Youtube-Player'></div>" +
					"</div>" + 
					"<div class='text-center modal-close'>" +
						"<a type='' class=' no-float btn btn-danger' ng-click='closeModal()' aria-label='Close'><span aria-hidden='true'>Close Video</span></a>" +
					"</div>" + 	
				"</div>" +
			"</div>" +
		"</div>";

		//function createModal
    	modal = angular.element(modalTpl);
    	$el.append($compile(modal)($scope));

    	modal.modal({
    		show: false,
    	}).on({
			'hide.bs.modal': function() { $scope.stopVideo(); }
		});

    	$scope.addModal(modal);

    	
		triggerClass = (attrs == "") ? '.youtube-link' : '.' + attrs.youtubeModal;
		
		triggers = $el.find(triggerClass);
		activate_trigger = function($trigger) {
			var href = $($trigger).attr('href');
			var yt_target = findYoutubeID(href);

			angular.element($trigger).data('yt_target', yt_target).bind('click', function(e) {
				$scope.play($(this).data('yt_target'));
				return false;
			})
		}


		$window.onYouTubeIframeAPIReady = function() {
			$scope.initPlayer();
			angular.forEach(triggers, activate_trigger);
		};

		
		$scope.$on(YT_event.STOP, function() {
			player.seekTo(0);
			player.stopVideo();
		});

		$scope.$on(YT_event.PLAY, function() {
			player.playVideo();
		});

		$scope.$on(YT_event.PAUSE, function() {
			player.pauseVideo();
		});

		function findYoutubeID(href) {
			var match = href.match(/[http(?:s?)?:]?\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/);
			
			if(!match || !match.length)
				return false;

			return match[1];
		};


	    function getModalDims() {

			var w = 0, maxW = 0, winH = $window.innerHeight, winW = $window.innerWidth;

			maxW = .8 * winW;
			w = (winH / 3) * 4;

			if(w > maxW)
				w = maxW;

			return {
				width: Math.round(w),
				height: Math.round(winH) - 100
			}
		};


    }
  };
}]);
})();