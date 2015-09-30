(function() {

  var Play = window.States.Play = function() {}

  Play.prototype = {
    preload: function() {},
    create: function() {
      this.facing = 'right'

      this.game.physics.startSystem(Phaser.Physics.P2JS)
      this.game.physics.startSystem(Phaser.Physics.ARCADE)

      this.game.stage.backgroundColor = '#000000'

      var bg = this.game.add.tileSprite(0, 0, 800, 600, 'background')
      bg.fixedToCamera = true

      var map = this.game.add.tilemap('level1');
      map.addTilesetImage('tiles-1');
      map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

      this.mapLayer = map.createLayer('Tile Layer 1');
      // layer.debug = true; //  Un-comment this on to see the collision tiles
      this.mapLayer.resizeWorld();

      this.game.physics.arcade.gravity.y = 500;

      this.player = this.game.add.sprite(32, 32, 'dude');
      this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

      this.player.body.bounce.y = 0.1;
      this.player.body.collideWorldBounds = true;
      this.player.body.setSize(20, 32, 5, 16);

      this.player.animations.add('left', [0, 1, 2, 3], 10, true);
      this.player.animations.add('turn', [4], 20, true);
      this.player.animations.add('right', [5, 6, 7, 8], 10, true);

      this.game.camera.follow(this.player);

      this.cursors = this.game.input.keyboard.createCursorKeys();
      this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },
    update: function() {
      this.game.physics.arcade.collide(this.player, this.mapLayer);

      this.player.body.velocity.x = 0;

      if (this.cursors.left.isDown) {
          this.player.body.velocity.x = -150

          if (this.facing != 'left') {
              this.player.animations.play('left')
              this.facing = 'left'
          }
      } else if (this.cursors.right.isDown) {
          this.player.body.velocity.x = 150

          if (this.facing != 'right') {
              this.player.animations.play('right')
              this.facing = 'right'
          }
      } else if (this.facing != 'idle') {
          this.player.animations.stop();

          if (this.facing == 'left') {
              this.player.frame = 0
          } else {
              this.player.frame = 5
          }

          this.facing = 'idle'
      }

      if (this.jumpButton.isDown && this.player.body.onFloor()) {
          this.player.body.velocity.y = -250
          // jumpTimer = game.time.now + 750
      }
    }
  }

})()
