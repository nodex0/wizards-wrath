Wizard.Preloader = function(game) {
	this.background = null;
	this.loaderBar = null;

	this.ready = false;
};

Wizard.Preloader.prototype = {

	preload: function() {

		game.add.image(0, 0, 'loading');
		this.loadingDragon = game.add.sprite(0, 15, 'loading_dragon');
		this.loadingDragon.animations.add('fly', [0, 1], 2, true);
		this.loadingDragon.animations.play('fly');
		this.loadingDragon.tremble = game.add.tween(this.loadingDragon).to({ y: '+2' }, 250, Phaser.Easing.Linear.None, true).loop(true);

		game.load.onFileComplete.add(this.fileComplete, this);
		game.load.onLoadComplete.add(this.loadComplete, this);

		this.load.image('how_to', 'res/how_to.png');
		this.load.image('menu', 'res/main_menu.png');
		this.load.image('level_end', 'res/level_end.png');
		this.load.image('press_space', 'res/press_space.png');
		this.load.image('game_over', 'res/game_over.png');
		this.load.image('game_over_letters', 'res/game_over_letters.png');
		this.load.image('game_won', 'res/game_won.png');
		this.load.image('black_screen', 'res/black_screen.png', 300, 200);

		this.load.spritesheet('menu_start_button', 'res/menu_start_button.png', 100, 50);
		this.load.spritesheet('menu_howto_button', 'res/menu_howto_button.png', 150, 50);

		this.load.image('health_bar_empty', 'res/health_bar_empty.png');
		this.load.image('health_bar_full', 'res/health_bar_full.png');

		this.load.spritesheet('wizard_sprite', 'res/wizard_sprite.png', 40, 60);
		this.load.spritesheet('person_sprite', 'res/person_sprite.png', 36, 59);
		this.load.image('soul_aura', 'res/soul.png');
		this.load.spritesheet('soul_person_sprite', 'res/soul_person_sprite.png', 27, 41);

		this.load.spritesheet('dragon_sprite', 'res/dragon_sprite.png', 150, 120);
		this.load.spritesheet('dragon_firebreath', 'res/dragon_firebreath.png', 80, 80);
		this.load.image('dragon_shadow', 'res/dragon_shadow.png');

		this.load.spritesheet('spell_lightning_h', 'res/spell_lightning_h.png', 210, 60);
		this.load.spritesheet('spell_lightning_v', 'res/spell_lightning_v.png', 60, 210);
		this.load.image('speed_boost', 'res/speed_boost.png');

		this.load.image('mana_bar', 'res/mana_bar.png', 20, 100);
		this.load.spritesheet('mana_liquid', 'res/mana_liquid.png', 20, 100);

		game.load.tilemap('level0', 'res/maps/level0.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('level1', 'res/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('level2', 'res/maps/level2.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('level3', 'res/maps/level3.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('town_tileset', 'res/maps/tiles/tileset_town.png');

		game.load.start();

	},

	create: function() {


	},

	fileComplete: function(progress, cacheKey, success, totalLoaded, totalFiles) {
		if(typeof this.loadingDragon.tween !== 'undefined')
			this.loadingDragon.tween.stop();
		this.loadingDragon.tween = game.add.tween(this.loadingDragon).to({ x: 0 + ((220+this.loadingDragon.width)*(progress/100)) }, 1500, Phaser.Easing.Linear.None, true);
		if(totalLoaded === totalFiles)
			this.loadingDragon.tween.onComplete.add(function() { this.state.start('Menu'); }, this);
	},

	loadComplete: function() {
	}

}