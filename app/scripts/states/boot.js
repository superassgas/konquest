(function() {

  var Boot = window.State.Boot = function() {}

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
