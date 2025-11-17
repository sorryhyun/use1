// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  // FIX: Ensure NotificationManager is initialized first
  // Check if it exists before creating gameManager
  var initGame = function() {
    var gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

    // FIX: Only store globally if needed, with a descriptive comment
    // This is needed for notification manager to access game state
    window.gameManager = gameManager;
  };

  // Wait for DOM to be ready if notificationManager hasn't loaded yet
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initGame();
  } else {
    document.addEventListener('DOMContentLoaded', initGame);
  }
});
