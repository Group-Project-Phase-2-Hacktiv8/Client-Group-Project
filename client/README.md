# ⚔️ RPG Typing Quest - Client

Real-time multiplayer typing race game dengan tema RPG/Fantasy.

## 🎮 Features

- ✨ Real-time multiplayer menggunakan Socket.io
- 🤖 AI Bot dengan 3 tingkat kesulitan
- 🎨 RPG-themed UI dengan animasi
- 🎵 Background music dan sound effects
- 🏆 Leaderboard dan progress tracking
- 👥 Room system dengan maksimal 5 pemain
- 🌍 Support bahasa Indonesia & English

## 🎵 Sound System

Aplikasi menggunakan sistem sound effect dan background music yang lengkap:

### Background Music

- **Lobby Theme** - Musik saat di lobby
- **Waiting Theme** - Musik di waiting room
- **Racing Theme** - Musik saat pertandingan
- **Victory Theme** - Musik saat menang

### Sound Effects

- **Button Click** - Saat klik tombol
- **Game Start** - Saat game dimulai
- **Typing** - Saat mengetik kata dengan benar
- **Victory** - Saat menang
- **Error** - Saat salah mengetik

### Sound Controls

- Toggle sound on/off menggunakan button di kanan atas
- Mute state tersimpan di localStorage
- Auto-play dengan fallback untuk browser restrictions

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## 📁 Project Structure

```
src/
├── components/
│   ├── race/          # Race track & typing area
│   ├── screens/       # All game screens
│   └── ui/            # Reusable UI components
├── contexts/          # React Context (GameContext)
├── hooks/             # Custom hooks (useSocket)
├── utils/             # Utilities (soundManager, characters)
└── styles/            # Global styles
```

## 🎨 Tech Stack

- React 19 + Vite
- Socket.io Client
- React Router v7
- Lucide Icons
- TailwindCSS (via custom CSS)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
