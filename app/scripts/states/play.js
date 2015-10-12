(function() {

  var Play = window.State.Play = function() {}

  Play.prototype = {
    preload: function() {
      this.load.image('bulletBlue', 'assets/sprites/bullet-blue.png')
      this.load.image('bulletFire', 'assets/sprites/bullet-fire.png')
      this.load.image('bulletRocket', 'assets/sprites/bullet-rocket.png')
      this.load.spritesheet('kaboom', 'assets/sprites/explode.png', 128, 128)
    },

    onJoinPlayer: function(playerStateData) {
      var player = this.game.add.sprite(32, 32, 'dude')

      this.game.physics.enable(player, Phaser.Physics.ARCADE)

      player.id = playerStateData.id
      player.facing = 'right'

      player.body.bounce.y = 0.1
      player.body.collideWorldBounds = true
      player.body.setSize(20, 32, 5, 16)
      player.cursors = {left: {}, right: {}, up: {}}
      player.spaceButton = {}

      // TODO change weapon as necessary
      player.weapon = new Weapon.Rocket(this.game)

      player.animations.add('left', [0, 1, 2, 3], 10, true)
      player.animations.add('turn', [4], 20, true)
      player.animations.add('right', [5, 6, 7, 8], 10, true)

      this.players.push(player)
      this.playerMap[playerStateData.id] = player

      if (playerStateData.id === this.game.localPlayerId) {
        this.game.camera.follow(player)
        this.player = player
      }
    },

    onUpdatePlayer: function(playerStateData) {
      var player = this.playerMap[playerStateData.id];
      player.cursors = playerStateData.cursors;
      player.spaceButton = playerStateData.spaceButton;
    },

    create: function() {
      this.game.physics.startSystem(Phaser.Physics.P2JS)
      this.game.physics.startSystem(Phaser.Physics.ARCADE)

      this.game.stage.backgroundColor = '#000000'

      var bg = this.game.add.tileSprite(0, 0, 800, 600, 'background')
      bg.fixedToCamera = true

      var map = this.game.add.tilemap('level1');
      map.addTilesetImage('tiles-1');
      map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

      this.mapLayer = map.createLayer('Tile Layer 1');
      // this.mapLayer.debug = true; //  Un-comment this on to see the collision tiles
      this.mapLayer.resizeWorld();

      this.game.physics.arcade.gravity.y = 900;

      this.cursors = this.game.input.keyboard.createCursorKeys();
      this.spaceButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

      // var self = this;
      // TODO connect to socket
      this.players = []
      this.playerMap = {}
      this.game.localPlayerId = 123

      this.bullets = this.game.add.group()
      this.bullets.enableBody = true
      this.bullets.physicsBodyType = Phaser.Physics.ARCADE
      this.bullets.createMultiple(30, 'bullet')
      this.bullets.setAll('anchor.x', 0.5)
      this.bullets.setAll('anchor.y', 0.5)
      this.bullets.setAll('allowGravity', false)
      this.bullets.setAll('outOfBoundsKill', true)
      this.bullets.setAll('checkWorldBounds', true)
      this.nextFire = 0

      this.explosions = this.game.add.group()
      for(var i = 0; i < 30; i++) {
        var explosion = this.explosions.create(0, 0, 'kaboom', [0], false)
        explosion.anchor.set(0.5, 0.5)
        explosion.animations.add('kaboom')
      }
      // this.explosions.createMultiple(30, 'kaboom');
      // this.explosions.setAll('anchor.x', 0.5)
      // this.explosions.setAll('anchor.y', 0.5)

      // Temporary offline solution
      setTimeout(function() {
        this.onJoinPlayer({
          id: 123
        });

        setInterval(function() {
          this.onUpdatePlayer({
            id: 123,
            cursors: this.cursors,
            spaceButton: this.spaceButton
          });
        }.bind(this), 100);
      }.bind(this), 50);
    },

    bulletToFloor: function(bullet, floor) {
      var explosionAnimation = this.explosions.getFirstExists(false);

      explosionAnimation.reset(bullet.x, bullet.y);
      explosionAnimation.play('kaboom', 16, false, true);

      bullet.kill()
    },

    update: function() {

      this.players.forEach(function(player) {
        this.game.physics.arcade.collide(player, this.mapLayer);
        this.game.physics.arcade.collide(this.player.weapon, this.mapLayer, this.bulletToFloor, null, this);

        player.body.velocity.x = 0;
        player.body.acceleration.y = 0;
        player.body.velocity.y = Math.max(player.body.velocity.y, -1500)
        player.body.velocity.y = Math.min(player.body.velocity.y, 600)

        if (player.cursors.left.isDown) {
            player.body.velocity.x = -150

            if (player.facing != 'left') {
                player.animations.play('left')
                player.facing = 'left'
            }
        } else if (player.cursors.right.isDown) {
            player.body.velocity.x = 150

            if (player.facing != 'right') {
                player.animations.play('right')
                player.facing = 'right'
            }
        } else if (player.facing != 'idle') {
            player.animations.stop();

            if (player.facing == 'left') {
                player.frame = 0
            } else {
                player.frame = 5
            }

            player.facing = 'idle'
        }

        if (player.cursors.up.isDown && player.body.onFloor()) {
            player.body.velocity.y = -350
        }

        if (player.spaceButton.isDown) {
            player.body.acceleration.y = -1100
        }
      }.bind(this));

      // TODO remove during online
      if (this.player && this.game.input.activePointer.isDown && this.game.time.now > this.nextFire) {
        this.nextFire = this.game.time.now + 100

        // var bullet = this.bullets.getFirstExists(false);
        // bullet.reset(this.player.body.x, this.player.body.y);
        // // bullet.tracking = true
        // // var angle = this.game.physics.arcade.angleToPointer(this.player, this.game.input.activePointer)
        // bullet.rotation = this.game.physics.arcade.angleToPointer(this.player, this.game.input.activePointer)
        // // console.log(bullet.rotation)
        // this.game.physics.arcade.velocityFromAngle(bullet.angle, 500, bullet.body.velocity)

        this.player.weapon.fire(this.player, this.game.physics.arcade.angleToPointer(this.player, this.game.input.activePointer))
      }
    }
  }

})()
