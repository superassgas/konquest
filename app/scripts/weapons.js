(function() {
  var Weapon = window.Weapon = {}

  Weapon.Base = function (game, key) {
    Phaser.Sprite.call(this, game, 0, 0, key)
    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST
    this.anchor.set(0.5, 0.5)
    this.checkWorldBounds = true
    this.outOfBoundsKill = true
    this.exists = false

    this.tracking = false
    this.scaleSpeed = 0

    this.debug = true // Un-comment this to see the collision box
  }
  Weapon.Base.prototype = Object.create(Phaser.Sprite.prototype)
  Weapon.Base.prototype.constructor = Weapon.Base

  Weapon.Base.prototype.fire = function (x, y, rotation, speed, gx, gy) {
    gx = gx || 0
    gy = gy || 0

    this.reset(x, y)
    this.scale.set(1)

    var angle = rotation * (180 / Math.PI)  // Convert to degrees
    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity)

    this.angle = angle

    this.body.gravity.set(gx, gy)
  }

  Weapon.Base.prototype.update = function () {
    if (this.tracking) {
      this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x)
    }

    if (this.scaleSpeed > 0) {
      this.scale.x += this.scaleSpeed
      this.scale.y += this.scaleSpeed
    }
  }

})()
