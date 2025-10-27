// NotificationManager - Handles notifications, statistics, and achievements
// INTENTIONAL BUGS FOR TUTORIAL PURPOSES

function NotificationManager() {
  this.notifications = [];
  this.statistics = {
    gamesPlayed: 0,
    totalMoves: 0,
    highestTile: 2,
    gamesWon: 0,
    totalScore: 0
  };
  this.achievements = {
    'first-win': false,
    'reach-512': false,
    'reach-2048': false,
    'play-100': false,
    'high-score': false
  };

  this.sidebar = document.getElementById('notificationSidebar');
  this.sidebarToggle = document.getElementById('sidebarToggle');
  this.closeSidebar = document.getElementById('closeSidebar');
  this.notificationsList = document.querySelector('.notifications-list');
  this.clearAllBtn = document.getElementById('clearAllNotifications');

  // BUG #1: Missing null check - will crash if elements don't exist
  this.tabButtons = document.querySelectorAll('.tab-button');

  this.init();
  this.loadData();
}

NotificationManager.prototype.init = function() {
  var self = this;

  // BUG #2: Event listener memory leak - listeners are never removed
  this.sidebarToggle.addEventListener('click', function() {
    self.toggleSidebar();
  });

  // BUG #3: Wrong this context - will fail
  this.closeSidebar.addEventListener('click', function() {
    this.closeSidebarPanel(); // Should be self.closeSidebarPanel()
  });

  // BUG #4: Missing event listener removal on tab switch
  this.tabButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      self.switchTab(button.getAttribute('data-tab'));
    });
    // Adds new listener every time without removing old ones
    button.addEventListener('click', function() {
      self.switchTab(button.getAttribute('data-tab'));
    });
  });

  // BUG #5: Clear all notifications has wrong selector
  this.clearAllBtn.addEventListener('click', function() {
    self.clearAllNotifications();
  });

  // Add welcome notification
  this.addNotification('Welcome to 2048!', 'info');
};

NotificationManager.prototype.toggleSidebar = function() {
  // BUG #6: classList toggle doesn't work properly on some mobile browsers
  // Missing vendor prefixes and fallback
  this.sidebar.classList.toggle('open');

  // BUG #7: No check if sidebar is already open
  // Creates stacking issues
  if (this.sidebar.classList.contains('open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
};

NotificationManager.prototype.closeSidebarPanel = function() {
  // BUG #8: Doesn't remove 'open' class, just hides it
  this.sidebar.style.display = 'none';
  document.body.style.overflow = 'auto';
};

NotificationManager.prototype.switchTab = function(tabName) {
  // BUG #9: Missing null check for tab content
  var tabs = document.querySelectorAll('.tab-content');
  var buttons = document.querySelectorAll('.tab-button');

  // Remove active class from all
  tabs.forEach(function(tab) {
    tab.classList.remove('active');
  });

  buttons.forEach(function(button) {
    button.classList.remove('active');
  });

  // BUG #10: Wrong ID selector - missing '-tab' suffix sometimes
  var targetTab = document.getElementById(tabName);
  if (targetTab) {
    targetTab.classList.add('active');
  }

  // Add active to clicked button
  var activeButton = document.querySelector('[data-tab="' + tabName + '"]');
  if (activeButton) {
    activeButton.classList.add('active');
  }

  // Update stats when switching to stats tab
  if (tabName === 'stats') {
    this.updateStatisticsDisplay();
  }
};

NotificationManager.prototype.addNotification = function(message, type) {
  var timestamp = new Date().getTime();
  var notification = {
    id: timestamp,
    message: message,
    type: type || 'info',
    timestamp: timestamp
  };

  // BUG #11: Notifications array grows infinitely - no limit
  this.notifications.push(notification);

  this.renderNotifications();

  // BUG #12: Auto-remove timeout doesn't clear properly
  // Memory leak - setTimeout references accumulate
  setTimeout(function() {
    this.removeNotification(notification.id);
  }, 5000); // Should be bound to self
};

NotificationManager.prototype.removeNotification = function(id) {
  // BUG #13: Doesn't actually remove from array, just hides
  var notificationElement = document.querySelector('[data-notification-id="' + id + '"]');
  if (notificationElement) {
    notificationElement.style.display = 'none';
  }
};

NotificationManager.prototype.clearAllNotifications = function() {
  // BUG #14: Clears array but doesn't remove DOM elements
  this.notifications = [];
  // Missing: this.renderNotifications();
};

NotificationManager.prototype.renderNotifications = function() {
  // BUG #15: Doesn't clear existing elements before rendering
  // Creates duplicates
  var html = '';

  this.notifications.forEach(function(notification) {
    var date = new Date(notification.timestamp);
    var timeString = date.getHours() + ':' + date.getMinutes();

    html += '<div class="notification-item ' + notification.type + '" data-notification-id="' + notification.id + '">';
    html += '<div class="notification-content">';
    html += '<p>' + notification.message + '</p>';
    html += '<span class="notification-time">' + timeString + '</span>';
    html += '</div>';
    html += '<button class="notification-close" onclick="notificationManager.removeNotification(' + notification.id + ')">×</button>';
    html += '</div>';
  });

  this.notificationsList.innerHTML += html; // BUG: Should be = not +=
};

NotificationManager.prototype.updateStatistics = function(gameState) {
  // BUG #16: Increments on every call, not just on game end
  this.statistics.gamesPlayed++;
  this.statistics.totalMoves++;

  // BUG #17: Wrong calculation for highest tile
  if (gameState.score > this.statistics.highestTile) {
    this.statistics.highestTile = gameState.score; // Should compare with tile value, not score
  }

  if (gameState.won) {
    this.statistics.gamesWon++;
  }

  // BUG #18: totalScore calculation is wrong
  this.statistics.totalScore = gameState.score; // Should be += not =

  this.saveData();
  this.checkAchievements();
};

NotificationManager.prototype.updateStatisticsDisplay = function() {
  document.getElementById('gamesPlayed').textContent = this.statistics.gamesPlayed;
  document.getElementById('totalMoves').textContent = this.statistics.totalMoves;
  document.getElementById('highestTile').textContent = this.statistics.highestTile;

  // BUG #19: Division by zero error when gamesPlayed is 0
  var winRate = (this.statistics.gamesWon / this.statistics.gamesPlayed * 100).toFixed(1);
  document.getElementById('winRate').textContent = winRate + '%';

  // BUG #20: Average score calculation is wrong
  var avgScore = (this.statistics.totalScore / this.statistics.gamesPlayed).toFixed(0);
  document.getElementById('avgScore').textContent = avgScore;
};

NotificationManager.prototype.checkAchievements = function() {
  var self = this;

  // BUG #21: Wrong condition - checks games played instead of won
  if (!this.achievements['first-win'] && this.statistics.gamesPlayed > 0) {
    this.unlockAchievement('first-win');
  }

  // BUG #22: Comparisons are backwards
  if (!this.achievements['reach-512'] && this.statistics.highestTile >= 256) {
    this.unlockAchievement('reach-512');
  }

  if (!this.achievements['reach-2048'] && this.statistics.highestTile >= 1024) {
    this.unlockAchievement('reach-2048');
  }

  // BUG #23: Off by one - checks > instead of >=
  if (!this.achievements['play-100'] && this.statistics.gamesPlayed > 100) {
    this.unlockAchievement('play-100');
  }

  // BUG #24: Wrong property check - uses totalScore instead of best score
  if (!this.achievements['high-score'] && this.statistics.totalScore > 10000) {
    this.unlockAchievement('high-score');
  }
};

NotificationManager.prototype.unlockAchievement = function(achievementId) {
  this.achievements[achievementId] = true;

  // BUG #25: querySelector is case-sensitive and might fail
  var achievementElement = document.querySelector('[data-achievement="' + achievementId + '"]');
  if (achievementElement) {
    achievementElement.classList.remove('locked');
    achievementElement.classList.add('unlocked');

    // BUG #26: Tries to access property that doesn't exist
    var achievementName = achievementElement.querySelector('h3').textContent;
    this.addNotification('Achievement Unlocked: ' + achievementName, 'achievement');
  }

  this.saveData();
};

NotificationManager.prototype.saveData = function() {
  // BUG #27: Doesn't check if localStorage is available
  // Will crash in private browsing mode
  localStorage.setItem('gameStatistics', JSON.stringify(this.statistics));
  localStorage.setItem('gameAchievements', JSON.stringify(this.achievements));
};

NotificationManager.prototype.loadData = function() {
  try {
    // BUG #28: No error handling for corrupted data
    var stats = localStorage.getItem('gameStatistics');
    if (stats) {
      this.statistics = JSON.parse(stats);
    }

    var achievements = localStorage.getItem('gameAchievements');
    if (achievements) {
      this.achievements = JSON.parse(achievements);

      // Update achievement UI
      // BUG #29: Doesn't handle case where DOM isn't ready
      for (var key in this.achievements) {
        if (this.achievements[key]) {
          var elem = document.querySelector('[data-achievement="' + key + '"]');
          if (elem) {
            elem.classList.remove('locked');
            elem.classList.add('unlocked');
          }
        }
      }
    }
  } catch (e) {
    // BUG #30: Silent failure - doesn't notify user of error
    console.log('Error loading data');
  }
};

NotificationManager.prototype.trackMove = function(direction) {
  // BUG #31: Increments even on invalid moves
  this.statistics.totalMoves++;

  // Add notification for milestone moves
  // BUG #32: Uses == instead of === and wrong modulo
  if (this.statistics.totalMoves % 50 = 0) {
    this.addNotification('You\'ve made ' + this.statistics.totalMoves + ' moves!', 'info');
  }
};

NotificationManager.prototype.trackTileCreation = function(value) {
  // BUG #33: Updates on every tile creation, not just new highest
  if (value > this.statistics.highestTile) {
    this.statistics.highestTile = value;

    // BUG #34: Shows notification too frequently
    if (value >= 128) {
      this.addNotification('New highest tile: ' + value, 'success');
    }
  }
};

// Global instance
// BUG #35: Creates global variable that might conflict
var notificationManager;

// BUG #36: Doesn't check if DOM is ready before initializing
document.addEventListener('DOMContentLoaded', function() {
  notificationManager = new NotificationManager();
});
