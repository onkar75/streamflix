# StreamFlix 🎬

A TV show dashboard application built with Vue 3, allowing users to browse, filter, and search TV shows using the [TVMaze API](http://www.tvmaze.com/api).

---

## ✨ Features

- **Genre-based Dashboard** — Shows organized in horizontal scrollable rows by genre
- **Rating Sorted** — Shows within each genre sorted by rating (highest first)
- **Search** — Real-time debounced search to find shows by name
- **Filtering** — Filter by category and minimum rating (7+, 8+, 9+)
- **Show Details** — Detailed view with poster, metadata, genres, and cast
- **Dark/Light Theme** — Toggle between themes with persistent styling
- **Responsive Design** — Mobile-friendly layout with touch-scroll support
- **Sticky Header** — Navigation always accessible while scrolling

---

## 🏗️ Architecture & Technical Decisions

### Why Vue 3?

- **Assignment Requirement** — ABN AMRO uses Vue.js
- **Composition API** — Better TypeScript support and code organization with `<script setup>`

### State Management: Pinia

- Official Vue 3 store with excellent TypeScript integration
- Composition API style with `defineStore`
- Centralized state for shows, search results, and loading states
- Computed getters for derived data (`showsByGenre`, `isSearching`)

### Project Structure

```
src/
├── assets/          # CSS and static assets
├── components/      # Reusable UI components
│   ├── FilterBar.vue
│   ├── GenreRow.vue
│   ├── Header.vue
│   ├── SearchBar.vue
│   ├── ShowCard.vue
│   └── ShowCast.vue
├── pages/           # Route-level views
│   ├── HomePage.vue
│   └── ShowDetailsPage.vue
├── router/          # Vue Router configuration
├── services/        # API layer (TVMaze)
├── stores/          # Pinia stores
├── types/           # TypeScript interfaces
└── utils/           # Utility functions (debounce)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `^20.19.0` or `>=22.12.0`
- **npm**: `10.x` or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd streamflix

# Install dependencies
npm install
```

### Development

```bash
# Start dev server (http://localhost:5173)
npm run dev
```

### Production Build

```bash
# Type-check and build
npm run build

# Preview production build
npm run preview
```

---

## 🧪 Testing

Unit tests are written with **Vitest** and **Vue Test Utils**.

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Test Coverage

- **Components**: FilterBar, GenreRow, Header, SearchBar, ShowCard, ShowCast
- **Pages**: HomePage, ShowDetailsPage
- **Store**: shows.store (actions, getters, state)
- **Services**: tvmaze.api (API calls, error handling)
- **Utils**: debounce function

---

## 📱 Responsive Design

- **Desktop**: Full horizontal scroll rows with arrow navigation
- **Tablet/Mobile**: Touch-friendly scroll, hidden arrows, adjusted padding
- **Breakpoint**: 768px for mobile-specific styles

---

## 📋 Assignment Checklist

- ✅ Vue.js framework
- ✅ TV shows grouped by genre in horizontal lists
- ✅ Shows sorted by rating within each genre
- ✅ Show details page with comprehensive information
- ✅ Search feature to look up shows by name
- ✅ Responsive and mobile-friendly
- ✅ Minimal use of scaffolding/boilerplate
- ✅ Unit tests included
- ✅ Clean, reusable code
- ✅ README with architectural decisions and setup instructions
