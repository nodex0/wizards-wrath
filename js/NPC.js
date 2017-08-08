NPC = {
	create : {
		person : function(x, y, props) {
			if(typeof props === 'undefined')
				props = {}
			for(var k in props) {
				props[k] = parseInt(props[k]);
			}
			if(!('mana' in props))
				props.mana = 1;
			else if(props.mana <= 0)
				props.mana = 1;
			if(!('hp' in props))
				props.hp = 2;
			if(!('maxMana' in props))
				props.maxMana = 11;
			if(!('maxSpeed' in props))
				props.maxSpeed = game.rnd.integerInRange(15,40);
			if(!('minSpeed' in props))
				props.minSpeed = 15;
			var person = game.add.sprite(x, y, 'person_sprite');
			person.animations.add('forward', [0, 1, 2, 1], 5, true);
			person.animations.add('right', [3, 4, 5, 4], 5, true);
			person.animations.add('left', [6, 7, 8, 7], 5, true);
			game.physics.arcade.enable(person);
			person.body.width = 18;
			person.body.height = 36;
			person.body.offset.setTo(8, 20);
			/*if('mana' in props && props.mana > 0) {
				var manaAura = game.make.sprite(0, 0, 'person_sprite_mana');
				manaAura.alpha = props.mana/10;
				person.addChild(manaAura);
			}*/
			entityGroup.add(person);
			targetArray.push(person);
			person.type = 'person';
			person.stats = props;
			person.runningCooldown = 0;
			people.push(person);
		},
		soulPerson : function(x, y, props) {
			if(typeof props === 'undefined')
				props = {}
			for(var k in props) {
				props[k] = parseInt(props[k]);
			}
			if(!('hp' in props))
				props.hp = 2;
			if(!('mana' in props))
				props.mana = 25;
			if(!('maxMana' in props))
				props.maxMana = 15;
			if(!('maxSpeed' in props))
				props.maxSpeed = game.rnd.integerInRange(60,75);
			if(!('minSpeed' in props))
				props.minSpeed = 45;
			var child = game.add.sprite(x, y, 'soul_person_sprite');
			child.anchor.setTo(0.5, 1);
			child.animations.add('forward', [0, 1], 10, true);
			child.animations.add('right', [2, 3], 10, true);
			child.animations.add('left', [4, 5], 10, true);
			child.animations.add('die_left', [6, 8], 2, false);
			child.animations.add('die_right', [7, 9], 2, false);
			var manaAura = game.make.sprite(0, 0, 'soul_aura');
			manaAura.alpha = 0.75;
			manaAura.anchor.setTo(0.5, 1);
			manaAura.tween = game.add.tween(manaAura).to({ alpha: 0.1 }, 700, Phaser.Easing.Linear.InOut, true).yoyo(true).loop(true);
			child.aura = manaAura;
			child.addChild(manaAura);
			game.physics.arcade.enable(child);
			entityGroup.add(child);
			targetArray.push(child);
			child.type = 'soul_person';
			child.stats = props;
			child.runningCooldown = 0;
			people.push(child);
		},
		dragonBoss : function(x, y, props) {
			if(typeof props === 'undefined')
				props = {}
			for(var k in props) {
				props[k] = parseInt(props[k]);
			}
			if(!('hp' in props))
				props.hp = 300;
			if(!('maxHp' in props))
				props.maxHp = 300;
			if(!('mana' in props))
				props.mana = 500;
			if(!('maxMana' in props))
				props.maxMana = 10000;
			if(!('speed' in props))
				props.speed = 40;
			if(!('walkSpeed' in props))
				props.walkSpeed = 40;
			if(!('runSpeed' in props))
				props.runSpeed = 75;
			if(!('fireDamage' in props))
				props.fireDamage = 5;
			var dragon = game.add.sprite(x, y, 'dragon_sprite');
			dragon.type = 'dragon';
			dragon.phase = 1;
			dragon.direction = 'down';
			dragon.anchor.setTo(0.5, 1);
			dragon.animations.add('backwards', [0, 2, 1, 2], 10, true);
			dragon.animations.add('forward', [5, 3, 4, 3], 10, true);
			dragon.animations.add('left', [8, 6, 8, 7], 10, true);
			dragon.animations.add('right', [11, 9, 10, 9], 10, true);
			dragon.animations.add('fly', [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], 15, true);
			dragon.blockAnimation = false;
			game.physics.arcade.enable(dragon);
			dragon.body.setCircle(35);
			dragon.body.immovable = true;
			dragon.body.mass = 100;
			dragon.shadow = game.add.sprite(x, y, 'dragon_shadow');
			dragon.shadow.anchor.setTo(0.5, 1);
			dragon.shadow.alpha = 0;
			dragon.body.offset.set(dragon.width/2 - 35, dragon.height/2 - 15);
			entityGroup.add(dragon);
			targetArray.push(dragon);
			dragon.stats = props;
			dragon.state = 'WALKING';
			// Health bar
			var healthBarEmpty = game.add.sprite(0, 5, 'health_bar_empty');
			healthBarEmpty.anchor.setTo(0.5, 1);
			healthBarEmpty.alpha = 0.8;
			dragon.addChild(healthBarEmpty);
			var healthBarFull = game.add.sprite(0, 0, 'health_bar_full');
			healthBarFull.anchor.setTo(0, 1);
			healthBarFull.x = -healthBarEmpty.width/2;
			healthBarEmpty.addChild(healthBarFull);
			healthBarFull.maxWidth = healthBarFull.width;
			dragon.healthBar = healthBarFull;
			dragon.castBreath = function() {
				if(dragon.state === 'WALKING')
					dragon.state = 'CASTING';
				dragon.body.velocity.x = 0; dragon.body.velocity.y = 0;
				dragon.animations.stop(null, true);
				var fireBreath = game.add.sprite(0, 0, 'dragon_firebreath');
				fireBreath.onHit = function(target, projectile) {
					if(target.type === 'dragon')
						return;
					if(projectile.damage > 0) {
						target.stats.hp -= projectile.damage;
						target.stats.mana -= projectile.damage;
						projectile.damage = 0;
						game.time.events.remove(projectile.selfDestruct);
						var removeTween = game.add.tween(projectile).to({ alpha : 0 }, 500, Phaser.Easing.Linear.None, false);
						removeTween.onComplete.add(function() {
							projectile.destroy();
						}, this);
						removeTween.start();
					}
				}
				game.physics.arcade.enable(fireBreath);
				fireBreath.body.setSize(fireBreath.width-30, fireBreath.height-30, 15, 15);
				fireBreath.damage = dragon.stats.fireDamage;
				fireBreath.x = dragon.x; fireBreath.y = dragon.y;
				enemyProjectiles.push(fireBreath);
				fireBreath.animations.add('down', [0, 1], 5, true);
				fireBreath.animations.add('left', [2, 3], 5, true);
				fireBreath.animations.add('right', [4, 5], 5, true);
				fireBreath.animations.add('up', [6, 7], 5, true);
				fireBreath.animations.play(dragon.direction);
				if(dragon.direction === 'down') {
					dragon.frame = 12; 
					fireBreath.body.velocity.y = 50;
				} else if(dragon.direction === 'up') {
					dragon.frame = 13; 
					fireBreath.y -= 25;
					fireBreath.body.velocity.y = -50;
				} else if(dragon.direction === 'left') {
					dragon.frame = 14;
					fireBreath.x -= 30; 
					fireBreath.y -= 15;
					fireBreath.body.velocity.x = -50;
				} else if(dragon.direction === 'right') {
					dragon.frame = 15; 
					fireBreath.x += 30;
					fireBreath.y -= 15;
					fireBreath.body.velocity.x = 50;
				}
				var trembleTween = game.add.tween(dragon).to({ x : '+2' }, 50, Phaser.Easing.Linear.None, false, 0, 20);
				trembleTween.onComplete.add(function() {
					if(dragon.state === 'CASTING') {
						dragon.state = 'WALKING';
					}
				})
				trembleTween.start();
				fireBreath.anchor.setTo(0.5, 1);
				fireBreath.selfDestruct = game.time.events.add(4000, function() {
					var removeTween = game.add.tween(fireBreath).to({ alpha : 0 }, 500, Phaser.Easing.Linear.None, false);
					removeTween.onComplete.add(function() {
						fireBreath.destroy();
					}, this);
					removeTween.start();
				}, this);			}
			dragon.castFastBreath = function() {
				dragon.blockAnimation = true;
				game.time.events.add(500, function() { dragon.blockAnimation = false; }, this);
				var fireBreath = game.add.sprite(0, 0, 'dragon_firebreath');
				fireBreath.onHit = function(target, projectile) {
					if(target.type === 'dragon')
						return;
					if(projectile.damage > 0) {
						target.stats.hp -= projectile.damage;
						target.stats.mana -= projectile.damage;
						projectile.damage = 0;
						game.time.events.remove(projectile.selfDestruct);
						var removeTween = game.add.tween(projectile).to({ alpha : 0 }, 500, Phaser.Easing.Linear.None, false);
						removeTween.onComplete.add(function() {
							projectile.destroy();
						}, this);
						removeTween.start();
					}
				}
				game.physics.arcade.enable(fireBreath);
				fireBreath.body.setSize(fireBreath.width-30, fireBreath.height-30, 15, 15);
				enemyProjectiles.push(fireBreath);
				fireBreath.damage = dragon.stats.fireDamage;
				fireBreath.animations.add('down', [0, 1], 5, true);
				fireBreath.animations.add('left', [2, 3], 5, true);
				fireBreath.animations.add('right', [4, 5], 5, true);
				fireBreath.animations.add('up', [6, 7], 5, true);
				fireBreath.x = dragon.x; fireBreath.y = dragon.y;
				fireBreath.animations.play(dragon.direction);
				var fireTo = {};
				if(dragon.direction === 'down') {
					dragon.frame = 12; 
				} else if(dragon.direction === 'up') {
					dragon.frame = 13; 
					fireBreath.y -= 25;
				} else if(dragon.direction === 'left') {
					dragon.frame = 14;
					fireBreath.x -= 30; 
					fireBreath.y -= 15;
				} else if(dragon.direction === 'right') {
					dragon.frame = 15; 
					fireBreath.x += 30;
					fireBreath.y -= 15;
				}
				fireBreath.anchor.setTo(0.5, 1);
				game.physics.arcade.moveToObject(fireBreath, wizard, 90);
				fireBreath.selfDestruct = game.time.events.add(6000, function() {
					var removeTween = game.add.tween(fireBreath).to({ alpha : 0 }, 500, Phaser.Easing.Linear.None, false);
					removeTween.onComplete.add(function() {
						fireBreath.destroy();
					}, this);
					removeTween.start();
				}, this);
			}
			dragon.castFlying = function() {
				dragon.state = 'FLYING';
				dragon.animations.stop(null, true);
				dragon.animations.play('fly');
				dragon.body.enable = false;
				var fly1 = game.add.tween(dragon).to({ y : '-30'}, 1000, Phaser.Easing.Linear.None, false);
				var appearShadow = game.add.tween(dragon.shadow).to({ alpha: 0.7 }, 1000, Phaser.Easing.Linear.None, false);
				var dissapearShadow = game.add.tween(dragon.shadow).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, false);
				var fly2 = game.add.tween(dragon).to({ y : '-60'}, 2000, Phaser.Easing.Linear.None, false);
				var fly3 = game.add.tween(dragon);
				var followShadow = game.add.tween(dragon.shadow);
				var fly4 = game.add.tween(dragon).to({ y : '+90'}, 300, Phaser.Easing.Linear.None, false);
				fly1.chain(fly2);
				fly2.onComplete.add(function() {
					fly3.to({ x : wizard.x , y : wizard.y - 90}, 1000, Phaser.Easing.Linear.None, false).start();
					followShadow.to({ x : wizard.x , y : wizard.y}, 1000, Phaser.Easing.Linear.None, false).start();
				}, this);
				fly3.onComplete.add(function() {
					dissapearShadow.start();
					dragon.animations.stop(null, true);
					dragon.frame = 30;
					fly4.start();
				}, this);
				fly4.onComplete.add(function() {
					dragon.body.velocity.x = 0; dragon.body.velocity.y = 0;
						dragon.body.x = dragon.x; dragon.body.y = dragon.y;
						dragon.body.enable = true;	
					game.time.events.add(500, function() {
						dragon.direction = 'up';
						dragon.castBreath();				
					}, this);
					game.time.events.add(1500, function() {
						dragon.direction = 'left';
						dragon.castBreath();				
					}, this);
					game.time.events.add(2500, function() {
						dragon.direction = 'right';
						dragon.castBreath();				
					}, this);
					game.time.events.add(3500, function() {
						dragon.direction = 'down';
						dragon.castBreath();				
					}, this);
					game.time.events.add(4500, function() {
						dragon.state = 'WALKING';				
					}, this);
				}, this);
				fly1.start();
				appearShadow.start();
			}
			dragon.lastHealth = dragon.stats.hp;
			dragon.updateTick = function() {
				// Change phases, 3 phases
				if(dragon.stats.hp <= dragon.stats.maxHp * 1/3 && dragon.phase === 2) {
					dragon.phase = 3;
					dragon.stats.speed = dragon.stats.runSpeed;
					for(var k in dragon.animations._anims) {
						dragon.animations._anims[k].speed *= 1.5;
					}
					dragon.tint = 0x00ffff;
				} else if(dragon.stats.hp <= dragon.stats.maxHp * 2/3 && dragon.phase === 1) {
					dragon.phase = 2;
				}
				// Flash when hit
				if(dragon.lastHealth > dragon.stats.hp) {
					if(typeof dragon.tintEvent !== 'undefined')
						game.time.events.remove(dragon.tintEvent);
					if(dragon.phase === 1 || dragon.phase === 2) {
						dragon.tint = 0xff0000;
						dragon.tintIteration = 1;
						dragon.tintEvent = game.time.events.repeat(100, 8, function() {
							dragon.tint = Math.min(0xff0000 + 0x002222 * dragon.tintIteration++, 0xffffff);
						}, this);
					}
				}
				dragon.healthBar.width = (dragon.stats.hp / dragon.stats.maxHp) * dragon.healthBar.maxWidth;
				dragon.lastHealth = dragon.stats.hp;
				// Move the dragon
				if(dragon.state === 'WALKING') {
					dragon.shadow.x = dragon.x;
					dragon.shadow.y = dragon.y;
					dragon.lookingAngle = game.physics.arcade.angleBetween(dragon, wizard);
					game.physics.arcade.velocityFromAngle(Phaser.Math.radToDeg(dragon.lookingAngle), dragon.stats.speed, dragon.body.velocity);
					if(Math.abs(dragon.body.velocity.x) > Math.abs(dragon.body.velocity.y)) {
						if(dragon.body.velocity.x > 0) {
							dragon.direction = 'right';
							if(dragon.blockAnimation === false)
								dragon.animations.play('right');
						} else {
							dragon.direction = 'left';
							if(dragon.blockAnimation === false)
								dragon.animations.play('left');
						}
					} else {
						if(dragon.body.velocity.y > 0) {
							dragon.direction = 'down';
							if(dragon.blockAnimation === false)
								dragon.animations.play('backwards');
						} else {
							dragon.direction = 'up';
							if(dragon.blockAnimation === false)
								dragon.animations.play('forward');
						}
					}
				} else if(dragon.state === 'CASTING') {
					dragon.body.velocity.x = 0; dragon.body.velocity.y = 0;
				}
			},
			dragon.attackTick = function() {
				if(dragon.stats.hp <= 0 || dragon.stats.mana <= 0)
					return;
				var nextAttack = 3000;
				if(dragon.state === 'WALKING') {
					if(dragon.phase === 1) {
						dragon.castBreath();
					} else if(dragon.phase === 2) {
						dragon.castFlying();
					} else if(dragon.phase === 3) {
						dragon.castFastBreath();
						nextAttack = 2000;	
					}
				}
				game.time.events.add(nextAttack, dragon.attackTick, this);
			}
			game.time.events.add(3000, dragon.attackTick, this);
			boss = dragon;
		}
	},
	interact: {
		collisionEntity : function(wizard, entity) {
			// If it is a normal person, he will suck your mana
			if(entity.type === 'person') {
				if(entity.stats.mana >= entity.stats.maxMana)
					return;
				if(typeof entity.stealCooldown === 'undefined') {
					entity.stealCooldown = 0;
				}
				if(entity.stealCooldown >= game.time.time)
					return;
				entity.stealCooldown = game.time.time + 500;
				entity.stats.mana += 2;
				wizard.stats.mana -= 2;
			}
			// If it is a soul person, suck his mana
			else if(entity.type === 'soul_person') {
				if(entity.stats.mana <= 0)
					return;
				cameraUnfollow();
				wizard.state = 'STEALING_MANA';
				wizard.trembleTween = game.add.tween(wizard).to({ y : '+1' }, 50, Phaser.Easing.Linear.InOut, true, 0, 20, true);
				entity.body.velocity.x = 0; entity.body.velocity.y = 0;
				entity.stats.mana = 0;
				entity.animations.stop(null, true);
				wizard.animations.stop(null, true);
				if(wizard.x > entity.x) { // victim <| wizard
					entity.frame = 7;
				} else {
					entity.frame = 6;
				}
				if(wizard.lookingAngle === 0)
					wizard.frame = 18;
				else if(wizard.lookingAngle === 90)
					wizard.frame = 19;
				else if(wizard.lookingAngle === 180)
					wizard.frame = 17;
				else if(wizard.lookingAngle === 270)
					wizard.frame = 20;
				entity.aura.tween.stop();
				var removeAuraTween = game.add.tween(entity.aura);
				removeAuraTween.onComplete.add(function() {
					wizard.trembleTween.stop();
					cameraFollow();
					wizard.stats.mana = wizard.stats.mana + entity.stats.maxMana > 100 ? 100 : wizard.stats.mana + entity.stats.maxMana;
					if(wizard.x > entity.x) { // victim <| wizard
						entity.frame = 9;
					} else {
						entity.frame = 8;
					}
					wizard.state = 'FREE';
				}, null, this);
				removeAuraTween.to({ alpha: 0 }, 1000, Phaser.Easing.Linear.InOut, true);
			}
			// If it is the boss, drain mana F A S T
			else if(entity.type === 'dragon') {
				if(entity.stats.mana >= entity.stats.maxMana)
					return;
				if(typeof entity.stealCooldown === 'undefined') {
					entity.stealCooldown = 0;
				}
				if(entity.stealCooldown >= game.time.time)
					return;
				entity.stealCooldown = game.time.time + 200;
				entity.stats.mana += 2;
				wizard.stats.mana -= 2;
			}
		}
	}
}