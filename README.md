# Polytopia Chess Clone MVP

An implementation of a simplified chess-like strategy game using units and mechanics inspired by _The Battle of Polytopia_. This MVP provides a local, single-player experience on an 8×8 grid, featuring basic movement, combat, action points, and win/lose conditions.

---

## 🎯 Features

- **Single Game State** stored in **LocalStorage** for **New Game** / **Resume Game**
- **Grid-Based Board**: 8×8 square map with `Tile` entities storing coordinates and occupant
- **Units**: Six unit types (`warrior`, `archer`, `rider`, `catapult`, `knight`, `mind bender`), each with base stats and skills
- **Action Points**: Players receive a fixed number of AP per turn (scales every 10 turns) to move, attack, or use skills
- **Skills**: Passive (`dash`, `escape`, `relentless`) and active (`charge`, `heal`, `multiAttack`, `longShot`) abilities with AP costs
- **Turn Management**: Handles player order, AP budget, and per-unit action flags (`canMove`, `canAttack`)
- **Win Condition**: Capture the enemy `mind bender` (king) or resign

---

## 📂 Project Structure

```
├── public/                # Static assets (images, icons)
├── src/
│   ├── components/        # React components
│   │   ├── game/          # GameBoard, BoardTile, HUD, Menu
│   │   └── unit/          # UnitView, skill icons
│   ├── context/           # GameContext and provider
│   ├── data/              # Static game data (unitStats, unitSkills)
│   ├── pages/             # Page components used for routing
│   ├── types/             # TypeScript interfaces and types
│   ├── utils/             # Game logic helpers (movement, combat)
│   ├── views/             # HomeView, GameView
│   └── App.tsx            # App entry
├── .eslintrc.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/mirasnag/polytopia_mvp.git
   cd polytopia_mvp
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run in development**

   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open the app** in your browser:

   ```

   ```
