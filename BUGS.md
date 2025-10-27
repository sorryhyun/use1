# Intentional Bugs Documentation

This document lists all the intentional bugs added to the 2048 game for tutorial purposes. Students should identify and fix these bugs as part of their learning experience.

## JavaScript Bugs (notification_manager.js)

### Memory Leaks & Event Listeners
1. **Line 31**: Missing null check for DOM elements - will crash if elements don't exist
2. **Lines 36-39**: Event listener memory leak - listeners are never removed
3. **Line 43**: Wrong `this` context in event handler (should use `self` instead of `this`)
4. **Lines 48-54**: Duplicate event listeners added without removing old ones
5. **Line 103**: `setTimeout` in `addNotification` doesn't bind context properly

### DOM Manipulation Issues
6. **Line 71**: `classList.toggle` missing vendor prefixes and fallback
7. **Line 82**: Sidebar close function uses `style.display` instead of removing class
8. **Line 96**: Wrong ID selector - missing '-tab' suffix sometimes
9. **Line 115**: `removeNotification` only hides elements, doesn't remove from array
10. **Line 121**: `clearAllNotifications` clears array but doesn't re-render DOM
11. **Line 132**: `renderNotifications` uses `+=` instead of `=`, creating duplicates

### Statistics & Calculation Errors
12. **Line 143**: `updateStatistics` increments on every call, not just on game end
13. **Line 147**: Wrong comparison - compares score with highestTile instead of tile value
14. **Line 154**: `totalScore` uses `=` instead of `+=`
15. **Lines 161-162**: Division by zero error when `gamesPlayed` is 0
16. **Line 165**: Average score calculation is wrong

### Achievement Logic Bugs
17. **Line 171**: Wrong condition - checks games played instead of games won
18. **Line 175**: Comparison is backwards (checks for 256 instead of 512)
19. **Line 179**: Comparison is backwards (checks for 1024 instead of 2048)
20. **Line 183**: Off by one error - uses `>` instead of `>=`
21. **Line 187**: Uses `totalScore` instead of best score

### Storage & Data Issues
22. **Line 199**: No check if localStorage is available (crashes in private mode)
23. **Line 205**: No error handling for corrupted JSON data
24. **Line 216**: Doesn't handle case where DOM isn't ready yet
25. **Line 224**: Silent failure - doesn't notify user of errors

### Additional Logic Errors
26. **Line 232**: Uses `=` instead of `===` and wrong modulo operator
27. **Line 240**: Updates highest tile on every creation, not just new highest
28. **Line 245**: Shows notification too frequently

### Global Scope Issues
29. **Line 253**: Creates global variable that might conflict with other code
30. **Line 256**: Doesn't verify DOM is fully ready before initializing

## CSS/SCSS Bugs (style/main.scss)

### Z-Index & Layering Issues
31. **Line 564**: Z-index too low (50 instead of 1000+) - sidebar covered by game elements
32. **Line 559**: Initial position uses wrong offset value
33. **Line 572**: No overlay to prevent interaction with content behind sidebar
34. **Line 584**: Missing z-index on sticky header - tabs might overlap when scrolling
35. **Line 825**: Toggle button z-index too low

### Responsive Design Problems
36. **Line 847**: Fixed width on mobile doesn't account for small screens
37. **Line 850**: Sidebar covers entire screen but hard to close on mobile
38. **Line 856**: Toggle button overlaps with score container on mobile
39. **Line 869**: Tab text gets cut off on very small screens
40. **Line 876**: Achievement icons too large on mobile

### Missing UI States & Feedback
41. **Line 606**: No focus outline for accessibility on close button
42. **Line 604**: No hover state for close button
43. **Line 637**: No focus styles for keyboard navigation on tabs
44. **Line 633**: No visual indicator (border-bottom) for active tab
45. **Line 829**: No active state feedback on toggle button
46. **Line 839**: Toggle icon doesn't rotate when sidebar is open
47. **Line 721**: No disabled state for clear all button when empty

### Display & Transition Issues
48. **Line 642**: Uses `display: none` instead of visibility/opacity for smoother transitions
49. **Line 665**: No transition when notifications appear/disappear
50. **Line 749**: No animation when statistics values change
51. **Line 775**: Achievement animation plays every time, not just on unlock

### Content & Layout Bugs
52. **Line 590**: No text truncation if title is too long
53. **Line 625**: Tab button text wraps awkwardly on small screens
54. **Line 654**: No max-height on notifications list
55. **Line 686**: No word-break, long words will overflow
56. **Line 692**: Time format not padded (9:5 instead of 09:05)
57. **Line 703**: Click area too small for mobile (notification close button)
58. **Line 785**: No min-width on achievement icon, can shrink
59. **Line 795**: No text truncation on achievement titles

### Missing Features & Accessibility
60. **Line 568**: Missing scrollbar styling - ugly default scrollbars
61. **Line 677**: Low contrast background on achievement notifications
62. **Line 614**: Tabs not sticky - will scroll away
63. **Line 900**: Missing media query for very large screens
64. **Line 903**: No dark mode support
65. **Line 904**: Missing print styles - sidebar will print
66. **Line 905**: No RTL language support
67. **Line 906**: Missing reduced-motion media query for accessibility

## Game Logic Bugs (game_manager.js)

### Core Game Bugs
68. **Line 83**: Tile probability is inverted - generates mostly 4s instead of 2s (0.1 should be 0.9)
69. **Line 182**: Win condition checks for 1024 instead of 2048

### Notification Integration Issues
70. **Lines 24, 186, 207, 217, 227**: Missing null checks for `notificationManager`
71. **Line 26**: `updateStatistics` called on restart instead of game end
72. **Line 217**: Win notification shown every move after winning, not just once
73. **Line 218**: Wrong message text (says 1024 instead of 2048)
74. **Line 186**: `trackTileCreation` called too frequently, causes notification spam

## Integration Bugs (application.js)

75. **Line 3**: Comment warns that NotificationManager might not be initialized yet
76. **Line 8**: Creates global variable pollution with `window.gameManager`

## Summary

- **Total Bugs**: 76+ intentional bugs
- **Categories**:
  - JavaScript Logic: ~30 bugs
  - CSS/UI: ~40 bugs
  - Integration: ~6 bugs

These bugs range from simple (typos, wrong operators) to complex (memory leaks, race conditions, accessibility issues). They cover:
- Memory management
- Event handling
- DOM manipulation
- Responsive design
- Accessibility
- User experience
- Data persistence
- Game logic
- Performance issues

## Learning Objectives

Students working through these bugs will learn:
1. Debugging techniques (console, DevTools, testing)
2. JavaScript best practices
3. CSS/SCSS responsive design
4. Accessibility standards
5. Memory leak detection
6. Event listener management
7. DOM manipulation best practices
8. Mobile-first development
9. User experience design
10. Code review skills
