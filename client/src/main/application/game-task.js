(function() {
	"use strict";
	
	var Square = require('./square');
	
	exports.start = function () {
		return new GameTask();
	};

	function GameTask() {
		this._statusChanged = new Rx.BehaviorSubject(configuringStatus());
	}
	
	function configuringStatus() {
		return {
			statusName: 'configuring',
			match: function (visitor) {
				visitor.configuring();
			}
		};
	}
	
	function playingStatus() {
		return {
			statusName: 'playing',
			match: function (visitor) {
				visitor.playing(Square.SQUARES);
			}
		};
	}
	
	GameTask.prototype.startGame = function () {
		var self = this;
		this._statusChanged.take(1).subscribe(function (status) {
			if (status.statusName === 'configuring') {
				self._statusChanged.onNext(playingStatus());
			}
		});
	};
	
	GameTask.prototype.newGame = function () {
		this._statusChanged.onNext(configuringStatus());
	};
	
	GameTask.prototype.statusChanged = function () {
		return this._statusChanged.asObservable();
	};
}());