Wizard.Game  = function(game) {
};

Wizard.Game.prototype = {

	preload: function() {

		console.log(this);

		game.stage.disableVisibilityChange = true;

	},

	create: function() {

		// Prepare the world 
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.world.setBounds(0, 0, 300, 200);
		this.game.physics.setBoundsToWorld();

		// Create the map
		this.map = game.add.tilemap('level' + game.currentLevel, 25, 25);
		this.map.addTilesetImage('Tileset', 'town_tileset');
		this.map.setCollisionBetween(12, 13, true, 'Middle');
		this.map.setCollisionBetween(21, 22, true, 'Middle');
		this.map.setCollisionBetween(30, 32, true, 'Middle');
		this.map.setCollisionBetween(39, 41, true, 'Middle');
		this.map.setCollisionBetween(48, 50, true, 'Middle');
		this.map.setCollisionBetween(21, 22, true, 'Middle');
		this.map.setCollisionBetween(55, 127, true, 'Middle');
		this.map.setCollisionBetween(12, 13, true, 'Top');
		this.map.setCollisionBetween(21, 22, true, 'Top');
		this.map.setCollisionBetween(30, 32, true, 'Top');
		this.map.setCollisionBetween(39, 41, true, 'Top');
		this.map.setCollisionBetween(48, 50, true, 'Top');
		this.map.setCollisionBetween(21, 22, true, 'Top');
		this.map.setCollisionBetween(55, 127, true, 'Top');
		this.layer = this.map.createLayer('Bottom');
		this.layer.resizeWorld();
		//this.layer.debug = true;
		this.layerMiddle = this.map.createLayer('Middle');
		//this.layerMiddle.debug = true;
		this.layerTop = this.map.createLayer('Top');
		//this.layerTop.debug = true;

		// Create the wizard
		wizard = game.add.sprite(0, 0, 'wizard_sprite');
		wizard.anchor.setTo(0.5, 1);
		wizard.type = 'wizard';
		wizard.stats = {};
		wizard.stats.speed = 75;
		wizard.stats.mana = game.manaLeft;
		wizard.stats.maxMana = 100;
		wizard.stats.hp = 10000;
		wizard.frame = 3;
		wizard.state = 'FREE';
		wizard.lookingAngle = 0;
		var walkForward = wizard.animations.add('forward', [3,6,7,8,9,10,11,12], 10, true);
		var walkLeft = wizard.animations.add('left', [5,15,5,16], 5, true);
		var walkRight = wizard.animations.add('right', [4,13,4,14], 5, true);
		var walkBackwards = wizard.animations.add('backwards', [0,1,0,2], 5	, true);
		this.game.physics.arcade.enable(wizard, Phaser.Physics.ARCADE);
		wizard.body.height = 38;
		wizard.body.width = 32;
		wizard.body.offset.setTo(4, 20);

		wizard.speedBoostAura = game.add.sprite(wizard.x, wizard.y, 'speed_boost');
		wizard.speedBoostAura.alpha = 0;
		wizard.speedBoostAura.anchor.setTo(0.5, 0.5);

		wizard.body.collideWorldBounds = true;

		// Create the controls
		this.cursors = game.input.keyboard.createCursorKeys();
		var spell1Key = this.input.keyboard.addKey(Phaser.Keyboard.ONE);
		spell1Key.onDown.add(spells.lightning.cast, this);
		var spell2Key = this.input.keyboard.addKey(Phaser.Keyboard.TWO);
		spell2Key.onDown.add(spells.speed.cast, this);

		// Create function for camera management
		cameraFollow = function() {
			this.game.camera.follow(wizard);
			var w = this.game.camera.width / 2;
            var h = this.game.camera.height / 4;
            this.game.camera.deadzone = new Phaser.Rectangle((game.camera.width - w) / 2, (game.camera.height - h) / 2 + h * 0.75, w, h);
			this.game.camera.roundPx = false;
			//game.camera.x = wizard.x - 150;
			//game.camera.y = wizard.y - 100;
		}

		cameraUnfollow = function() {
			this.game.camera.unfollow();
		}

		cameraFollow();

		// Create the arrays and groups
		targetArray = [];
		enemyProjectiles = [];
		people = [];
		this.endGameTriggers = [];

		entityGroup = game.add.group();
		entityGroup.add(wizard);

		// Create map objects
		for(var i = 0; i < this.map.objects.Objects.length; i++) {
			this.createObject(this.map.objects.Objects[i]);
		}

		// Prepare the UI
		// Draw the liquid mana bar!
		manaLiquid = game.add.sprite(0, 0, 'mana_liquid');
		manaLiquid.anchor.setTo(0, 0);
		manaLiquid.fixedToCamera = true;
		manaLiquid.cameraOffset.setTo(5, 5);
		manaLiquid.lastMana = wizard.stats.mana;
		var moveMana = manaLiquid.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7, 8], 15, true);
		manaLiquid.animations.play('move');
		manaLiquid.cameraOffset.y = 5+100*((wizard.stats.maxMana-wizard.stats.mana)/wizard.stats.maxMana);
		this.manaLiquid = manaLiquid;

		var manaBar = game.add.sprite(0, 0, 'mana_bar');
		manaBar.anchor.setTo(0, 0);
		manaBar.fixedToCamera = true;
		manaBar.cameraOffset.setTo(5, 5);

		var manaLiquidMask = game.add.graphics(0, 0);
		manaLiquidMask.fixedToCamera = true;
		manaLiquidMask.cameraOffset.setTo(5, 5);
		manaLiquidMask.beginFill(0xffffff);
		manaLiquidMask.drawRect(manaBar.x, manaBar.y, manaBar.width, manaBar.height-2);
		manaLiquid.mask = manaLiquidMask;

		// Create a black screen for effects
		this.blackScreen = game.add.sprite(0, 0, 'black_screen');
		this.blackScreen.fixedToCamera = true;
		this.blackScreen.alpha = 0;

		if(wizard.state === 'BOSS') {
			cameraUnfollow();
			boss.state = 'PRESENTATION';
			boss.frame = 3;
			game.camera.x = wizard.x -150;
			game.camera.y = wizard.y -100;
			game.add.tween(game.camera).to({ x:boss.x - 150 , y:boss.y - 100 }, 1000, Phaser.Easing.Linear.None, true);
			game.time.events.add(2000, function() { boss.frame = 2; }, this);
			game.time.events.add(3000, function() { boss.frame = 1; }, this);
			game.time.events.add(4000, function() { 
				boss.castBreath();
			}, this);
			game.time.events.add(5000, function() { 
				var returnTween = game.add.tween(game.camera).to({ x:wizard.x - 150 , y:wizard.y - 100 }, 500, Phaser.Easing.Linear.None, false);
				returnTween.onComplete.add(function() {
					cameraFollow(); 
					boss.state = 'WALKING';
					wizard.state = 'FREE'; 
				}, this);
				returnTween.start();
			}, this);
		}

		// Create a function called each second
		game.time.events.loop(Phaser.Timer.SECOND, this.eachSecond, this);

	},

	collideMap: function(entity, collider) {
		if(entity.type === 'person') {
			entity.body.velocity.x = -entity.stats.velocityX;
			if(Math.abs(entity.body.velocity.x) > entity.body.velocity.y) {
				if(entity.body.velocity.x > 0) {
					entity.animations.play('right');
				} else {
					entity.animations.play('left');
				}
			} else {
				entity.animations.play('forward');
			}
		}
	},

	update: function() {

		// If you are dead, nothing happens
		if(wizard.state === 'DEAD')
			return;

		// Try to win by killing the boss
		if(typeof boss !== 'undefined') {
			if(boss.stats.hp <= 0 || boss.stats.mana <= 0) {
				boss.destroy();
				game.state.start('End');
			}
		}

		// Clean the scum of the earth
		for(var i = 0; i < targetArray.length; i++) {
			var o = targetArray[i];
			if('stats' in o) {
				if('hp' in o.stats) {
					if(o.stats.hp <= 0) {
						o.destroy();
					}
				}
				/*if('mana' in o.stats) {
					if(o.stats.mana <= 0) {
						o.destroy();
					}
				}*/
			}
		}

		// Try to kill wizard
		if(wizard.stats.mana <= 0 || wizard.stats.hp <= 0) {
			wizard.state = 'DEAD';
			cameraUnfollow();
			wizard.frame = 32;
			//wizard.anchor.setTo(0.5, 1); wizard.y += wizard.height;
			var endingTween = game.add.tween(wizard).to({ angle: 90 }, 500, Phaser.Easing.Linear.None, false);
			endingTween.onComplete.add(function() {
				wizard.frame = 31;
				wizard.tint = 0x333333;
				var blackenTween = game.add.tween(this.blackScreen).to({alpha: 1}, 1500, Phaser.Easing.Linear.None, false);
				blackenTween.onComplete.add(function() {
					game.state.start('GameOver');
				}, this);
				blackenTween.start();
			}, this);
			endingTween.start();
		}

		// Call updates on entities
		for(var i = 0; i < entityGroup.children.length; i++) {
			if(typeof entityGroup.children[i].updateTick !== 'undefined') {
				entityGroup.children[i].updateTick();
			}
		}

		// Check if game is won
		game.physics.arcade.overlap(wizard, this.endGameTriggers, function(wiz, trigger) {
			//var blacken = game.add.tween(this.blackScreen);
			//blacken.onComplete.add(function() {
				game.manaLeft = wizard.stats.mana;

				game.state.start('End');
			//}, this);
			//blacken.to({alpha : 1}, 1000, 'Linear', true, 0);
		});

		// Move mana in UI
		if(this.manaLiquid.lastMana !== wizard.stats.mana) {
			if(this.manaLiquid.lastMana - wizard.stats.mana > 1) {
				this.manaLiquid.tint = 0xff0000;
				this.manaLiquid.normalColorCooldown = game.time.time + 500;
			} else if(this.manaLiquid.lastMana - wizard.stats.mana < 1) {
				this.manaLiquid.tint = 0x00ff00;
				this.manaLiquid.normalColorCooldown = game.time.time + 1000;
			} 
			if(typeof this.manaLiquid.normalColorCooldown !== 'undefined')
				if(this.manaLiquid.normalColorCooldown !== null && this.manaLiquid.normalColorCooldown <= game.time.time) {
					this.manaLiquid.tint = 0xffffff;
					this.normalColorCooldown = null;
				}
			this.manaLiquid.lastMana = wizard.stats.mana;
			if(typeof this.manaLiquid.manaTween !== 'undefined') {
				this.manaLiquid.manaTween.stop();
			}
			this.manaLiquid.manaTween = game.add.tween(this.manaLiquid.cameraOffset).to({ y: 5+100*((wizard.stats.maxMana-wizard.stats.mana)/wizard.stats.maxMana)}, 500, Phaser.Easing.Exponential.InOut, true);
		}

		// Collide the map with the entities
		game.physics.arcade.collide(wizard, this.layerMiddle);
		game.physics.arcade.collide(wizard, this.layerTop);
		game.physics.arcade.collide(entityGroup, this.layerMiddle, this.collideMap, null, this);
		game.physics.arcade.collide(entityGroup, this.layerTop, this.collideMap, null, this);

		if(typeof boss !== 'undefined')
			game.physics.arcade.collide(wizard, boss, NPC.interact.collisionEntity);

		game.physics.arcade.overlap(wizard, enemyProjectiles, function(target, projectile) {
			projectile.onHit(target, projectile);
		});
		/*game.physics.arcade.overlap(people, enemyProjectiles, function(target, projectile) {
			projectile.onHit(target, projectile);
		});*/

		game.physics.arcade.overlap(wizard, people, NPC.interact.collisionEntity, null, this);

		// Choose the people running randomly
		for(var i = 0; i < people.length; i++) {
			var p = people[i];
			if(p.body === null)
				continue;
			if(p.runningCooldown >= game.time.time)
				continue;
			if(p.stats.mana === 0 || p.stats.hp === 0)
				continue;
			if((p.runningCooldown === 0) || game.rnd.integerInRange(1,150) === 1) { // && p.inCamera
				p.runningCooldown = game.time.time + 500;
				p.body.velocity.x = 0; p.body.velocity.y = 0;
				var gottaDo = game.rnd.integerInRange(1, 3);
				if(gottaDo === 1) {
					p.body.velocity.x += game.rnd.integerInRange(p.stats.minSpeed, p.stats.maxSpeed);
				} else if(gottaDo === 2) {
					p.body.velocity.x -= game.rnd.integerInRange(p.stats.minSpeed, p.stats.maxSpeed);
				} else if(gottaDo === 3) {

				}
				p.body.velocity.y -= game.rnd.integerInRange(p.stats.minSpeed, p.stats.maxSpeed);
				p.stats.velocityX = p.body.velocity.x;
				if(Math.abs(p.body.velocity.x) > Math.abs(p.body.velocity.y)) {
					if(p.body.velocity.x > 0) {
						p.animations.play('right');
					} else {
						p.animations.play('left');
					}
				} else {
					p.animations.play('forward');
				}
			}
		}

		var wiz = wizard;

		wiz.speedBoostAura.x = wiz.x;
		wiz.speedBoostAura.y = wiz.y;
		wiz.speedBoostAura.angle = wizard.lookingAngle;
		
		wiz.body.velocity.x = 0; wiz.body.velocity.y = 0;

		entityGroup.sort('y', Phaser.Group.SORT_ASCENDING);

		if(wizard.state === 'FREE') {
			if(this.cursors.left.isDown) { // Move left
				//wiz.lastWalkedFrame = 5;
				wiz.lookingAngle = 270;
				wiz.body.velocity.x -= wiz.stats.speed;
				if(!this.cursors.up.isDown && !this.cursors.down.isDown) {
					wiz.animations.play('left');
				}
			} 
			if(this.cursors.right.isDown) { // Move right
				wiz.lookingAngle = 90;
				wiz.body.velocity.x += wiz.stats.speed;
				//wiz.lastWalkedFrame = 4;
				if(!this.cursors.up.isDown && !this.cursors.down.isDown) {
					wiz.animations.play('right');
				}
			}
			if(this.cursors.up.isDown) { // Move up
				//wiz.lastWalkedFrame = 3;
				wiz.lookingAngle = 0;
				wiz.body.velocity.y -= wiz.stats.speed;
				wiz.animations.play('forward');
			}
			if(this.cursors.down.isDown) { // Move down
				//wiz.lastWalkedFrame = 0;
				wiz.lookingAngle = 180;
				wiz.body.velocity.y += wiz.stats.speed;
				wiz.animations.play('backwards');
			}
			if(wiz.body.velocity.x == 0 && wiz.body.velocity.y == 0) {
				if(wizard.animations.currentAnim.isPlaying) {
					wiz.animations.stop(null, true);
				}
				//wiz.frame = wiz.lastWalkedFrame;
			}
		}


	},



	render: function() {
		//game.debug.geom(game.camera.deadzone, 'rgba(255,0,0,1)');
		//game.debug.cameraInfo(game.camera, 32, 32);
		/*game.debug.body(wizard);
		game.debug.body(boss);
		for(var i = 0; i < people.length; i++) {
			game.debug.body(people[i]);
		}
		for(var i = 0; i < enemyProjectiles.length; i++) {
			game.debug.body(enemyProjectiles[i]);
		}*/
		/*if(typeof lightningSprite !== 'undefined')
			game.debug.body(lightningSprite);*/
	},

	eachSecond: function() {
		wizard.stats.mana -= 1;
	},

	createObject: function(obj) {
		if(obj.type === 'spawn') {
			wizard.x = obj.x;
			wizard.y = obj.y;
			this.game.camera.y = obj.y;
		} else if(obj.type === 'person') {
			NPC.create.person(obj.x, obj.y, obj.properties);
		} else if(obj.type === 'child') {
			NPC.create.soulPerson(obj.x, obj.y, obj.properties);
		} else if(obj.type === 'end') {
			var endTrigger = game.add.sprite(obj.x, obj.y, null);
			endTrigger.width = obj.width; endTrigger.height = obj.height;
			game.physics.enable(endTrigger, Phaser.Physics.ARCADE);
			this.endGameTriggers.push(endTrigger);
		} else if(obj.type === 'boss_dragon') {
			NPC.create.dragonBoss(obj.x, obj.y, obj.properties);
			wizard.state = 'BOSS';
		}
	}

}
