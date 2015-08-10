(function() {
	"use strict";
	
	var Square = require('./square');
	var GameTask = require('./game-task');
	
	describe('A Game task', function () {
		var task;
		var PLAYERS = [{}, {}, {}];
		
		beforeEach(function () {
			task = GameTask.start();
		});
		
		it('send a configuring status at start', function (done) {
			task.statusChanged().take(1).subscribe(function (status) {
				expect(status.statusName).to.eql('configuring');
			}, done, done);
		});
		
		it('send a playing status when starting game with board and players', function (done) {
			task.startGame(PLAYERS);
			
			task.statusChanged().take(1).subscribe(function (status) {
				expect(status.statusName).to.eql('playing');
				status.match({
					'playing': function (squares, players) {
						expect(squares).to.eql(Square.SQUARES);
						expect(players).to.eql(PLAYERS);
					}
				});
			}, done, done);
		});
		
		it('never sends two playing statuses in a row', function () {
			task.statusChanged().skip(2).take(1).subscribe(function (status) {
				throw new Error('should never send a second playing status');
			});
			
			task.startGame(PLAYERS);
			task.startGame(PLAYERS);
		});
		
		it('sends a configuring status when creating new game', function (done) {
			task.startGame(PLAYERS);
			task.newGame();
			
			task.statusChanged().take(1).subscribe(function (status) {
				expect(status.statusName).to.eql('configuring');
			}, done, done);
		});
	});
}());