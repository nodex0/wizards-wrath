Wizard = {
	Global: 0
}

Wizard.Boot = function(game) {};

Wizard.Boot.prototype = {

	preload: function() {
		game.stage.smoothed = false;
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
		game.scale.setUserScale(4, 4);
		game.renderer.renderSession.roundPixels = true;
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
		game.load.image('loading', 'res/loading.png');
		game.load.spritesheet('loading_dragon', 'res/loading_dragon.png', 104, 120);
	},
	
	create: function() {
		//game.world.scale.setTo(3, 3)
		game.state.start("Preloader");
	}

}