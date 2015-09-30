(function() {

  var Boot = window.States.Boot = function() {}

  Boot.prototype = {
    preload: function() {
      this.load.image('preloader', 'assets/preloader.gif')
    },
    create: function() {
      this.game.input.maxPointers = 1
      this.game.state.start('preload')
    }
  }

})()
