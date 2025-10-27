// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  // BUG: NotificationManager might not be initialized yet
  var gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

  // Store globally for notification manager to access
  // BUG: Creates global variable pollution
  window.gameManager = gameManager;
});
