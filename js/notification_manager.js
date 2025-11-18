// NotificationManager - Handles notifications, statistics, and achievements
// BUGS FIXED

function NotificationManager() {
  this.notifications = [];
  this.statistics = {
    gamesPlayed: 0,
    totalMoves: 0,
    highestTile: 2,
    gamesWon: 0,
    totalScore: 0,
    bestScore: 0
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

  // FIX #1: Added null check for DOM elements
  this.tabButtons = document.querySelectorAll('.tab-button');

  if (!this.sidebar || !this.sidebarToggle || !this.closeSidebar ||
      !this.notificationsList || !this.clearAllBtn || !this.tabButtons.length) {
    console.warn('NotificationManager: Some DOM elements not found. Initialization delayed.');
    return;
  }

  this.init();
  this.loadData();
}

NotificationManager.prototype.init = function() {
  var self = this;

  // FIX #2 & #3: Proper event listener setup with correct context
  this.sidebarToggle.addEventListener('click', function() {
    self.toggleSidebar();
  });

  this.closeSidebar.addEventListener('click', function() {
    self.closeSidebarPanel();
  });

  // FIX #4: Remove duplicate event listener
  this.tabButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      self.switchTab(button.getAttribute('data-tab'));
    });
  });

  // Clear all notifications handler
  this.clearAllBtn.addEventListener('click', function() {
    self.clearAllNotifications();
  });

  // Add welcome notification
  this.addNotification('Welcome to 2048!', 'info');
};

NotificationManager.prototype.toggleSidebar = function() {
  // FIX #6 & #7: Proper toggle with fallback
  if (this.sidebar.classList) {
    this.sidebar.classList.toggle('open');
  } else {
    // Fallback for older browsers
    var classes = this.sidebar.className.split(' ');
    var index = classes.indexOf('open');
    if (index >= 0) {
      classes.splice(index, 1);
    } else {
      classes.push('open');
    }
    this.sidebar.className = classes.join(' ');
  }

  if (this.sidebar.classList.contains('open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
};

NotificationManager.prototype.closeSidebarPanel = function() {
  // FIX #8: Use classList to remove 'open' class instead of hiding
  this.sidebar.classList.remove('open');
  document.body.style.overflow = 'auto';
};

NotificationManager.prototype.switchTab = function(tabName) {
  // FIX #9: Added null check for tab content
  var tabs = document.querySelectorAll('.tab-content');
  var buttons = document.querySelectorAll('.tab-button');

  if (!tabs.length || !buttons.length) return;

  // Remove active class from all
  tabs.forEach(function(tab) {
    tab.classList.remove('active');
  });

  buttons.forEach(function(button) {
    button.classList.remove('active');
  });

  // FIX #10: Correct ID selector with proper suffix
  var targetTab = document.getElementById(tabName + '-tab');
  if (!targetTab) {
    targetTab = document.getElementById(tabName);
  }

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

  // FIX #11: Limit notifications array size
  this.notifications.push(notification);
  if (this.notifications.length > 50) {
    this.notifications.shift();
  }

  this.renderNotifications();

  // FIX #12: Proper context binding for setTimeout
  var self = this;
  setTimeout(function() {
    self.removeNotification(notification.id);
  }, 5000);
};

NotificationManager.prototype.removeNotification = function(id) {
  // FIX #13: Actually remove from array
  var index = -1;
  for (var i = 0; i < this.notifications.length; i++) {
    if (this.notifications[i].id === id) {
      index = i;
      break;
    }
  }

  if (index >= 0) {
    this.notifications.splice(index, 1);
    this.renderNotifications();
  }
};

NotificationManager.prototype.clearAllNotifications = function() {
  // FIX #14: Clear array and re-render DOM
  this.notifications = [];
  this.renderNotifications();
};

NotificationManager.prototype.renderNotifications = function() {
  // FIX #15: Clear existing elements before rendering
  var html = '';

  this.notifications.forEach(function(notification) {
    var date = new Date(notification.timestamp);
    // FIX #18: Pad time format properly
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var timeString = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;

    html += '<div class="notification-item ' + notification.type + '" data-notification-id="' + notification.id + '">';
    html += '<div class="notification-content">';
    html += '<p>' + notification.message + '</p>';
    html += '<span class="notification-time">' + timeString + '</span>';
    html += '</div>';
    html += '<button class="notification-close" onclick="notificationManager.removeNotification(' + notification.id + ')">×</button>';
    html += '</div>';
  });

  this.notificationsList.innerHTML = html;
};

NotificationManager.prototype.updateStatistics = function(gameState) {
  // FIX #16: Only increment on game end
  if (gameState.gameEnded) {
    this.statistics.gamesPlayed++;

    if (gameState.won) {
      this.statistics.gamesWon++;
    }
  }

  // FIX #17 & #33: Compare with tile value, not score
  if (gameState.highestTile && gameState.highestTile > this.statistics.highestTile) {
    this.statistics.highestTile = gameState.highestTile;
  }

  // FIX #18: Use += for totalScore
  this.statistics.totalScore += gameState.score || 0;

  // Track best score
  if (gameState.score > this.statistics.bestScore) {
    this.statistics.bestScore = gameState.score;
  }

  this.saveData();
  this.checkAchievements();
};

NotificationManager.prototype.updateStatisticsDisplay = function() {
  var gamesPlayedEl = document.getElementById('gamesPlayed');
  var totalMovesEl = document.getElementById('totalMoves');
  var highestTileEl = document.getElementById('highestTile');
  var winRateEl = document.getElementById('winRate');
  var avgScoreEl = document.getElementById('avgScore');

  if (gamesPlayedEl) gamesPlayedEl.textContent = this.statistics.gamesPlayed;
  if (totalMovesEl) totalMovesEl.textContent = this.statistics.totalMoves;
  if (highestTileEl) highestTileEl.textContent = this.statistics.highestTile;

  // FIX #19: Handle division by zero
  var winRate = this.statistics.gamesPlayed > 0
    ? (this.statistics.gamesWon / this.statistics.gamesPlayed * 100).toFixed(1)
    : '0.0';
  if (winRateEl) winRateEl.textContent = winRate + '%';

  // FIX #20: Correct average score calculation
  var avgScore = this.statistics.gamesPlayed > 0
    ? (this.statistics.totalScore / this.statistics.gamesPlayed).toFixed(0)
    : '0';
  if (avgScoreEl) avgScoreEl.textContent = avgScore;
};

NotificationManager.prototype.checkAchievements = function() {
  var self = this;

  // FIX #21: Check games won, not games played
  if (!this.achievements['first-win'] && this.statistics.gamesWon > 0) {
    this.unlockAchievement('first-win');
  }

  // FIX #22 & #23: Correct comparisons for tile values
  if (!this.achievements['reach-512'] && this.statistics.highestTile >= 512) {
    this.unlockAchievement('reach-512');
  }

  if (!this.achievements['reach-2048'] && this.statistics.highestTile >= 2048) {
    this.unlockAchievement('reach-2048');
  }

  // FIX #23: Use >= instead of >
  if (!this.achievements['play-100'] && this.statistics.gamesPlayed >= 100) {
    this.unlockAchievement('play-100');
  }

  // FIX #24: Use bestScore instead of totalScore
  if (!this.achievements['high-score'] && this.statistics.bestScore >= 10000) {
    this.unlockAchievement('high-score');
  }
};

NotificationManager.prototype.unlockAchievement = function(achievementId) {
  this.achievements[achievementId] = true;

  // FIX #25 & #26: Proper error handling
  var achievementElement = document.querySelector('[data-achievement="' + achievementId + '"]');
  if (achievementElement) {
    achievementElement.classList.remove('locked');
    achievementElement.classList.add('unlocked');

    var achievementNameEl = achievementElement.querySelector('h3');
    var achievementName = achievementNameEl ? achievementNameEl.textContent : achievementId;
    this.addNotification('Achievement Unlocked: ' + achievementName, 'achievement');
  }

  this.saveData();
};

NotificationManager.prototype.saveData = function() {
  // FIX #27: Check if localStorage is available
  try {
    if (typeof(Storage) !== 'undefined' && window.localStorage) {
      localStorage.setItem('gameStatistics', JSON.stringify(this.statistics));
      localStorage.setItem('gameAchievements', JSON.stringify(this.achievements));
    }
  } catch (e) {
    console.warn('localStorage not available:', e);
  }
};

NotificationManager.prototype.loadData = function() {
  try {
    // FIX #28: Proper error handling for corrupted data
    if (typeof(Storage) !== 'undefined' && window.localStorage) {
      var stats = localStorage.getItem('gameStatistics');
      if (stats) {
        try {
          this.statistics = JSON.parse(stats);
        } catch (e) {
          console.warn('Could not parse statistics data');
        }
      }

      var achievements = localStorage.getItem('gameAchievements');
      if (achievements) {
        try {
          this.achievements = JSON.parse(achievements);

          // FIX #29: Check if DOM is ready before updating
          if (document.readyState === 'complete' || document.readyState === 'interactive') {
            this.updateAchievementUI();
          } else {
            var self = this;
            document.addEventListener('DOMContentLoaded', function() {
              self.updateAchievementUI();
            });
          }
        } catch (e) {
          console.warn('Could not parse achievements data');
        }
      }
    }
  } catch (e) {
    // FIX #30: Better error handling with user notification
    console.error('Error loading data:', e);
    this.addNotification('Error loading saved data', 'info');
  }
};

NotificationManager.prototype.updateAchievementUI = function() {
  for (var key in this.achievements) {
    if (this.achievements[key]) {
      var elem = document.querySelector('[data-achievement="' + key + '"]');
      if (elem) {
        elem.classList.remove('locked');
        elem.classList.add('unlocked');
      }
    }
  }
};

NotificationManager.prototype.trackMove = function(direction, moved) {
  // FIX #31: Only increment on valid moves
  if (moved) {
    this.statistics.totalMoves++;

    // FIX #32: Use === and correct modulo operator
    if (this.statistics.totalMoves % 50 === 0) {
      this.addNotification('You\'ve made ' + this.statistics.totalMoves + ' moves!', 'info');
    }

    this.saveData();
  }
};

NotificationManager.prototype.trackTileCreation = function(value) {
  // FIX #33 & #34: Only update and notify on new highest, and less frequently
  if (value > this.statistics.highestTile) {
    this.statistics.highestTile = value;

    // Only show notification for significant milestones
    if (value >= 512) {
      this.addNotification('New highest tile: ' + value, 'success');
    }

    this.saveData();
    this.checkAchievements();
  }
};

// FIX #35 & #36: Better global initialization with DOM ready check
var notificationManager;

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  notificationManager = new NotificationManager();
} else {
  document.addEventListener('DOMContentLoaded', function() {
    notificationManager = new NotificationManager();
  });
}
