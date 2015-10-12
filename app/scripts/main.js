(function() {

  window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game')

    // Game States
    game.state.add('boot', State.Boot)
    game.state.add('gameover', State.GameOver)
    game.state.add('menu', State.Menu)
    game.state.add('play', State.Play)
    game.state.add('preload', State.Preload)

    game.state.start('boot')
  }

})()
