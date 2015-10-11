(function() {

  var Preload = window.States.Preload = function() {}

  Preload.prototype = {
    preload: function() {
      this.asset = this.add.sprite(this.width / 2, this.height / 2, 'preloader')
      this.asset.anchor.setTo(0.5, 0.5)

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this)
      this.load.setPreloadSprite(this.asset)

      this.load.tilemap('level1', 'assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON)
      this.load.image('tiles-1', 'assets/tiles/tiles-1.png')
      this.load.spritesheet('dude', 'assets/sprites/dude.png', 32, 48)
      this.load.spritesheet('droid', 'assets/sprites/droid.png', 32, 32)
      this.load.image('starSmall', 'assets/sprites/star.png')
      this.load.image('starBig', 'assets/sprites/star2.png')
      this.load.image('background', 'assets/backgrounds/background2.png')

      this.load.image('bullet', 'assets/sprites/bullet-blue.png')
      this.load.image('bulletFire', 'assets/sprites/bullet-fire.png')
      this.load.spritesheet('kaboom', 'assets/sprites/explode.png', 128, 128)
    },
    create: function() {
      // this.asset.cropEnabled = false
    },
    update: function() {
      if(this.ready) {
        this.game.state.start('menu')
      }
    },
    onLoadComplete: function() {
      this.ready = true
    }
  }

})()
