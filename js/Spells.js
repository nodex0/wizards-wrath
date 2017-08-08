var spells = {
	lightning : {
		known : true,
		cooldown : 0,
		castCooldown : 1,
		damage : 20,
		cast : function() {
			// If the spells is not know, cant cast
			if(!spells.lightning.known)
				return;
			// Wait cooldown
			if(spells.lightning.cooldown >= this.game.time.totalElapsedSeconds())
				return;
			// Wait for FREE state
			if(wizard.state !== 'FREE')
				return;
			// Reset cooldown
			spells.lightning.cooldown = this.game.time.totalElapsedSeconds() + spells.lightning.castCooldown;
			// Define lightning sprite
			if(wizard.lookingAngle === 0 || wizard.lookingAngle === 180) {
				lightningSprite = game.make.sprite(0, -30, 'spell_lightning_v');
			} else {
				lightningSprite = game.make.sprite(0, -30, 'spell_lightning_h');
			}
			wizard.animations.stop(null,true); 
			game.physics.arcade.enable(lightningSprite);
			// Rotate spell with the collider ;_; fucking hell
			if(wizard.lookingAngle === 0) {
				lightningSprite.body.setSize(lightningSprite.width-24, lightningSprite.height, 12, 0);
				wizard.bringToTop();
				lightningSprite.anchor.setTo(0.5, 1);
				wizard.frame = 22;
			}
			if(wizard.lookingAngle === 90) {
				lightningSprite.angle = 0;
				lightningSprite.x += 10;
				lightningSprite.anchor.setTo(0, 0.5);
				lightningSprite.body.setSize(lightningSprite.width, lightningSprite.height-30, 0, 15);
				wizard.frame = 23;
			}
			if(wizard.lookingAngle === 180) {
				lightningSprite.anchor.setTo(0.5, 1);
				lightningSprite.angle = wizard.lookingAngle;
				lightningSprite.body.setSize(lightningSprite.width-24, lightningSprite.height, 12, lightningSprite.height);
				wizard.frame = 21;
			}
			if(wizard.lookingAngle === 270) {
				lightningSprite.angle = 180;
				lightningSprite.x -= 12;
				lightningSprite.y += 4;
				lightningSprite.anchor.setTo(0, 0.5);
				lightningSprite.body.setSize(lightningSprite.width, lightningSprite.height-30, -lightningSprite.width, 15);
				wizard.frame = 24;
			}
			// Do the animation and effect
			game.physics.arcade.overlap(lightningSprite, this.targetArray, function(lightning, target) {
				target.stats.hp -= spells.lightning.damage;
			});
			var lightningAnim = lightningSprite.animations.add('lightning');
			lightningAnim.onComplete.add(function() {
				game.physics.arcade.overlap(lightningSprite, this.targetArray, function(lightning, target) {
					target.stats.hp -= spells.lightning.damage;
				});
			}, null, this);
			wizard.addChild(lightningSprite);
			lightningSprite.play('lightning', 30, false, true);
		}
	},
	speed : {
		known : true,
		cooldown: 0,
		castCooldown : 5,
		boost : 120,
		duration : 2,
		cast : function() {
			// If the spells is not know, cant cast
			if(!spells.speed.known)
				return;
			// Wait cooldown
			if(spells.speed.cooldown >= this.game.time.totalElapsedSeconds())
				return;
			// Wait for FREE state
			if(wizard.state !== 'FREE')
				return;
			// Reset cooldown
			spells.speed.cooldown = this.game.time.totalElapsedSeconds() + spells.speed.castCooldown;
			var originalSpeed = wizard.stats.speed;
			wizard.stats.speed = spells.speed.boost;
			var speedBoostAura = wizard.speedBoostAura;
			speedBoostAura.alpha = 1;
			var speedBoostAuraTween = game.add.tween(speedBoostAura);
			speedBoostAuraTween.to({ alpha: 0 }, spells.speed.duration*1000, Phaser.easing, true);
			var speedBoostTween = game.add.tween(wizard.stats);
			speedBoostTween.to({ speed: originalSpeed }, spells.speed.duration*1000, Phaser.Easing.Linear.None, true);
			speedBoostTween.start();
		}
	},
	blink : {

	},

}