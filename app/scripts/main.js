(function() {

  window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game')

    // Game States
    game.state.add('boot', States.Boot)
    game.state.add('gameover', States.GameOver)
    game.state.add('menu', States.Menu)
    game.state.add('play', States.Play)
    game.state.add('preload', States.Preload)

    game.state.start('boot')
  }

})()
