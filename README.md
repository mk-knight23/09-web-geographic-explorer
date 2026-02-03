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

## Features

- Interactive Global Country Directory (250+ countries)
- Multi-Tiered Search & Regional Filtering
- Rich Demographic & Geographic Insights
- Modern UI with Responsive Fluid Layouts
- Error Boundary & User-Friendly Error Handling
- Full Accessibility Support (ARIA labels, keyboard navigation)
- Unit Testing with Vitest & React Testing Library

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

## Live Links

Auto-deployed from GitHub main branch:

- **Vercel**: [https://09-web-geographic-explorer.vercel.app](https://09-web-geographic-explorer.vercel.app)
- **Render**: [https://09-web-geographic-explorer.onrender.com](https://09-web-geographic-explorer.onrender.com)
- **Firebase**: [https://web-geographic-explorer.web.app](https://web-geographic-explorer.web.app)
- **AWS Amplify**: [https://main.d1iawq8w3j5z5.amplifyapp.com](https://main.d1iawq8w3j5z5.amplifyapp.com)

## Deployment Configuration

### Render
Blueprint deployment via `render.yaml`:
- Build Command: `npm run build`
- Publish Directory: `dist`

### Firebase Hosting
Configuration in `firebase.json`:
- Public directory: `dist`
- SPA rewrite rules enabled

### AWS Amplify
Configuration in `amplify.yml`:
- Build output: `dist`
- Node.js 22

### Vercel
Connected via GitHub integration with auto-deploy on main branch pushes.

---

*Maintained by [Kazi Musharraf](https://github.com/mk-knight23)*
