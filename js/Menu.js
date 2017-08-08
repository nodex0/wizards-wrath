Wizard.Menu = function(game) {};

Wizard.Menu.prototype = {

	create: function() {

		this.add.image(0, 0, 'menu');
		//this.input.onDown.addOnce(this.start, this);
		this.startButton = this.add.sprite(175, 50, 'menu_start_button');
		this.howtoButton = this.add.sprite(140, 90, 'menu_howto_button');

		var tweenButton = function() {
			if(typeof this.buttonTween !== 'undefined')
				this.buttonTween.stop();
			this.startButton.y = 50;
			this.howtoButton.y = 90;
			var button = this.selectedButton === 0 ? this.startButton : this.howtoButton;
			this.buttonTween = game.add.tween(button).to({ y: '-5' }, 1000, Phaser.Easing.Sinusoidal.InOut, true).yoyo(true).loop(true);
		}

		this.selectedButton = 0;
		this.currentState = 'menu';
		tweenButton.call(this);

		var keyCallback = function(key) {
			if(this.currentState === 'menu') {
				if(this.selectedButton === 0) {
					this.start();
				} else if(this.selectedButton === 1) {
					this.currentState = 'help';
					this.howTo.alpha = 1;
				}
			} else {
				this.currentState = 'menu';
				this.howTo.alpha = 0;
			}

		}

		var key = game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
		key.onDown.add(keyCallback, this);
		var key2 = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		key2.onDown.add(keyCallback, this);

		var keyUp = game.input.keyboard.addKey(Phaser.KeyCode.UP);
		keyUp.onDown.add(function() {
			if(this.currentState === 'menu') {
				this.selectedButton--; 
				if(this.selectedButton === -1)
					this.selectedButton = 1;
				else if(this.selectedButton === 2)
					this.selectedButton = 0;
				tweenButton.call(this);
			} 
		}, this);
		var keyDown = game.input.keyboard.addKey(Phaser.KeyCode.DOWN);
		keyDown.onDown.add(function() {
			if(this.currentState === 'menu') { 
				this.selectedButton++;
				if(this.selectedButton === -1)
					this.selectedButton = 1;
				else if(this.selectedButton === 2)
					this.selectedButton = 0;
				tweenButton.call(this);
		}
		}, this);

		this.howTo = this.add.image(0, 0, 'how_to');
		this.howTo.alpha = 0;
	},

	update: function() {
		this.howtoButton.frame = 0;
		this.startButton.frame = 0;
		if(this.selectedButton === 0) {
			this.startButton.frame = 1;
		} else if(this.selectedButton === 1) {
			this.howtoButton.frame = 1;
		}
	},

	start: function() {

		game.currentLevel = 0;
		game.manaLeft = 100;
		this.state.start('Game');

	}

}

Wizard.End = function(game) {};

Wizard.End.prototype = {

	create: function() {

		if(game.currentLevel < 3) {
			this.add.sprite(0, 0, 'level_end');
		} else {
			this.add.sprite(0, 0, 'game_won'); // end the game
		}

		this.pressSpace = this.add.sprite(150, 150, 'press_space');
		this.pressSpace.anchor.setTo(0.5, 0.5);
		this.pressSpace.alpha = 0;

		black = this.add.image(0, 0, 'black_screen');
		black.alpha = 1;

		var key = game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
		key.onDown.add(this.keyCallback, this);
		var key2 = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		key2.onDown.add(this.keyCallback, this);

		this.currentState = 'DISPLAYING';

		var showTween = game.add.tween(black).to({ alpha : 0 }, 1500, Phaser.Easing.Linear.None, false);
		showTween.onComplete.add(function() {
			this.currentState = 'WAITING';
			this.pressSpace.alpha = 0.5;
			game.add.tween(this.pressSpace).to({ alpha : 1 }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
		}, this);
		showTween.start();

	},

	keyCallback: function(key) {
		if(this.currentState === 'WAITING') {
			this.next();
		}
		if(this.currentState === 'DISPLAYING') {

		}
	},

	update: function() {

	},

	next: function() {
		if(game.currentLevel < 3) {
			game.currentLevel += 1;
			this.state.start('Game');
		} else {
			this.state.start('Menu');
		}
	}

}

Wizard.GameOver = function(game) {};

Wizard.GameOver.prototype = {

	create: function() {
		game.add.sprite(0, 0, 'game_over'); //
		this.currentState = 'DISPLAYING';

		this.pressSpace = this.add.sprite(150, 150, 'press_space');
		this.pressSpace.anchor.setTo(0.5, 0.5);
		this.pressSpace.alpha = 0;

		this.gameOver = game.add.sprite(150, 80, 'game_over_letters');
		this.gameOver.alpha = 0;
		this.gameOver.anchor.setTo(0.5, 0.5);
		this.gameOver.scale.setTo(2, 2);
		this.gameOver.angle = 45;
		this.blackScreen = game.add.sprite(0, 0, 'black_screen');
		this.blackScreen.alpha = 1;
		this.blackScreenTween = game.add.tween(this.blackScreen).to({ alpha: 0 }, 2500, Phaser.Easing.Linear.None, false);
		this.blackScreenTween.onComplete.add(function() {
			this.gameOverTween = game.add.tween(this.gameOver).to({ alpha: 1, angle: -15 }, 1000, Phaser.Easing.Bounce.Out, false);
			this.gameOverTween.onComplete.add(function() {
				this.currentState = 'WAITING';
				this.pressSpace.alpha = 0.5;
				game.add.tween(this.pressSpace).to({ alpha : 1 }, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
			}, this);
			this.gameOverTween.start();
			game.add.tween(this.gameOver.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Linear.None, true);
		}, this);
		this.blackScreenTween.start();
		gameOver = this.gameOver;

		var key = game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
		key.onDown.add(this.keyCallback, this);
		var key2 = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		key2.onDown.add(this.keyCallback, this);
	},

	keyCallback: function(key) {
		if(this.currentState === 'WAITING') {
			game.state.start('Menu');
		}
	},

	update: function() {

	}

}