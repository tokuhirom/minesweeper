# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser-based Minesweeper game implemented in vanilla JavaScript with no build process or dependencies.

## Commands

- `npm test` - Run the Mocha test suite
- `open index.html` - Open the game in browser (or serve via any HTTP server)

## Architecture

### Core Classes (minesweeper.js)

1. **App** - Main controller that manages the game UI and user interactions
   - Creates and renders the game board
   - Handles click events (left-click to reveal, right-click to flag)
   - Shows game over/victory alerts

2. **Board** - High-level game board abstraction
   - Wraps the Matrix class for game-specific operations
   - Manages cell state transitions

3. **Cell** - Individual cell representation
   - Tracks: `hasBomb`, `isOpen`, `hasFlag`
   - Bomb probability: 0.1 (10%)
   - Display states: 'X' (closed), 'P' (flagged), '*' (bomb), '_' (empty), numbers (adjacent bombs)

4. **Matrix** - Core game logic and algorithms
   - Manages 2D cell array
   - Implements auto-reveal for empty cells
   - Handles victory condition checking
   - First-click protection (ensures first click is never a bomb)

### Key Game Mechanics

- Default board size: 8×6
- Right-click to flag/unflag cells
- Auto-reveal adjacent cells when clicking empty cells
- Victory: All non-bomb cells revealed
- Game over: Bomb cell revealed

## Testing

Tests use Mocha with Node's built-in assert. Current test coverage is minimal (only Matrix class basic functionality).

To run a single test:
```bash
npx mocha test.js --grep "test name pattern"
```

## Development Notes

- No TypeScript, no build process - pure ES6+ JavaScript
- Supports both browser and Node.js module systems
- DOM manipulation via vanilla JavaScript
- Uses browser alerts for game state notifications