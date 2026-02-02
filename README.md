# 09 Web Geographic Explorer

✨ A high-fidelity geographic data explorer providing real-time insights into nations across the globe with advanced filtering, error handling, and accessibility features.

## 🚀 Live Demo
**[View Live on Vercel](https://09-web-geographic-explorer.vercel.app)**

## 📦 Deployment

### Render (One-Click Deploy)
This repository includes a `render.yaml` blueprint for automated deployment:
1. Visit [dashboard.render.com](https://dashboard.render.com)
2. Click "New +" → "Blueprint"
3. Connect repository: `mk-knight23/09-web-geographic-explorer`
4. Render will auto-detect and apply the blueprint configuration

### Manual Deployment
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

## Features
- 🌍 Interactive Global Country Directory (250+ countries)
- 🔍 Multi-Tiered Search & Regional Filtering
- 📈 Rich Demographic & Geographic Insights
- 🎨 Modern UI with Responsive Fluid Layouts
- ⚛️ Engineered with React 19 & Vite 6
- 🛡️ Error Boundary & User-Friendly Error Handling
- ♿ Full Accessibility Support (ARIA labels, keyboard navigation)
- ✅ Unit Testing with Vitest & React Testing Library

## Tech Stack
- **Frontend**: React 19.2.3, TypeScript (strict mode)
- **Build Tool**: Vite 6.4.1
- **Styling**: Tailwind CSS v4.1.18
- **Icons**: Lucide React 0.474.0
- **Animations**: Framer Motion 12.29.2
- **HTTP Client**: Axios 1.13.3
- **Testing**: Vitest 2.1.9, React Testing Library 16.3.2

## Quick Start
```bash
npm install
npm run dev
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run type-check` - TypeScript type checking
- `npm run lint` - Run ESLint

## Testing
```bash
npm run test           # Run tests once
npm run test:ui        # Run tests with UI
npm run test:coverage  # Run tests with coverage report
```

## Portfolio Upgrades (2026-02-02)
- ✅ Removed all console statements
- ✅ Added ErrorBoundary component
- ✅ Implemented user-friendly error handling with retry
- ✅ Added input validation (XSS prevention)
- ✅ Full ARIA labels and accessibility attributes
- ✅ Keyboard navigation support
- ✅ Empty state handling
- ✅ Unit tests (5 tests, passing)
- ✅ TypeScript strict mode

## Documentation
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Design System](docs/DESIGN.md)
- [Deployment Guide](docs/DEPLOY.md)

## Live Deployment
- **GitHub Pages**: [https://mk-knight23.github.io/09-web-geographic-explorer/](https://mk-knight23.github.io/09-web-geographic-explorer/)
- **Vercel**: [https://09-web-geographic-explorer.vercel.app](https://09-web-geographic-explorer.vercel.app)
- **Status**: 🟢 Live
- **Last Updated**: 2026-02-02

---
*Portfolio-grade upgrade completed. Maintained by [Kazi Musharraf](https://github.com/mk-knight23)*
