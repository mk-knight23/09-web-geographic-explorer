# 09-web-geographic-explorer

# 09 Web Geographic Explorer

A high-fidelity geographic data explorer providing real-time insights into nations across the globe with advanced filtering, error handling, and accessibility features.

## Description

Interactive geographic explorer with map-based country discovery, powered by React 19, TypeScript, and Tailwind CSS v4. Browse 250+ countries with rich demographic data from the REST Countries API.

## Tech Stack

- **Frontend**: React 19.2.3, TypeScript (strict mode)
- **Build Tool**: Vite 6.4.1
- **Styling**: Tailwind CSS v4.1.18
- **Icons**: Lucide React 0.474.0
- **Animations**: Framer Motion 12.29.2
- **HTTP Client**: Axios 1.13.3
- **Testing**: Vitest 2.1.9, React Testing Library 16.3.2

---

## 🏗️ Architecture

### Project Structure

```
09-web-geographic-explorer/
├── src/
│   ├── components/       # Reusable components
│   │   ├── ui/           # UI components
│   │   │   ├── Card.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Tabs.tsx
│   │   ├── sections/     # Page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── CountryGrid.tsx
│   │   │   ├── SearchFilters.tsx
│   │   │   └── Stats.tsx
│   │   ├── layout/       # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Container.tsx
│   │   └── features/     # Feature-specific components
│   │       ├── CountryCard.tsx
│   │       ├── CountryDetail.tsx
│   │       ├── FilterPanel.tsx
│   │       └── SearchBar.tsx
│   ├── hooks/            # Custom hooks
│   │   ├── useCountries.ts
│   │   ├── useFilters.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   ├── services/         # API services
│   │   └── countries.ts  # REST Countries API
│   ├── types/            # TypeScript types
│   │   ├── country.ts
│   │   ├── filter.ts
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── context/          # React context
│   │   ├── ThemeContext.tsx
│   │   └── FilterContext.tsx
│   ├── styles/           # Global styles
│   │   └── globals.css
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── index.html            # HTML entry point
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
├── tailwind.config.ts    # Tailwind config
└── README.md             # This file
```

### Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 19.2.3 |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS v4.1.18 |
| **Animations** | Framer Motion 12.29.2 |
| **HTTP Client** | Axios 1.13.3 |
| **Build Tool** | Vite 6.4.1 |
| **Testing** | Vitest 2.1.9, React Testing Library |
| **Deployment** | CI/CD ready (Vercel/Netlify) |

### Key Architectural Patterns

- **Component-First**: Reusable, composable UI components
- **Type Safety**: Full TypeScript coverage with strict mode
- **Custom Hooks**: Encapsulated logic for data fetching and state
- **Context API**: Global state for themes and filters
- **Error Boundaries**: Graceful error handling
- **Code Splitting**: Route and component-based lazy loading
- **Optimistic UI**: Instant feedback for user interactions

### Data Layer

```typescript
// REST Countries API Integration
{
  endpoint: "https://restcountries.com/v3.1",
  methods: {
    getAll: "/all",
    getByRegion: "/region/{region}",
    getByCode: "/alpha/{code}",
    search: "/name/{name}"
  },
  features: [
    "250+ countries",
    "Population data",
    "Area & density",
    "Capital cities",
    "Currency info",
    "Languages",
    "Time zones"
  ]
}
```

### State Management

```
Local State → Context API → URL Query Params
     ↓              ↓               ↓
  UI States     Global State    Shareable URLs
```

- **useCountries**: Country data fetching with caching
- **useFilters**: Filter state with debounce
- **useLocalStorage**: Persistent preferences
- **ThemeContext**: Dark/light theme management
- **FilterContext**: Global filter state

### Performance Optimizations

- **Data Fetching**: Axios with request cancellation
- **Debouncing**: Search input debounced at 300ms
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: Ready for large lists
- **Image Optimization**: Lazy loading for flags
- **Code Splitting**: Route-based lazy loading

### Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and landmarks
- **Focus Management**: Proper focus traps in modals
- **Color Contrast**: WCAG AA compliant
- **Semantic HTML**: Proper heading structure
- **Skip Links**: Quick navigation to main content

### Filtering & Search

```typescript
{
  filters: {
    region: ["Africa", "Americas", "Asia", "Europe", "Oceania"],
    population: ["<1M", "1-10M", "10-50M", "50-100M", ">100M"],
    area: ["<100k", "100k-500k", "500k-1M", ">1M"],
    sortBy: ["name", "population", "area", "density"]
  },
  search: {
    query: string,
    debounce: 300ms,
    searchBy: ["name", "capital", "code"]
  }
}
```

---

*Last updated: 2026-02-28*
