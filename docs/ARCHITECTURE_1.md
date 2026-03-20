# Architecture: 06-country-explorer

## Overview
An interactive country exploration dashboard built with React 19 and Vite 6. ExploGeo allows users to browse global data using the REST Countries API with advanced filtering and search capabilities.

## Tech Stack
-   **Framework**: React 19
-   **Build Tool**: Vite 6
-   **Styling**: Tailwind CSS v4
-   **State Management**: React Hooks (useState, useEffect)
-   **Data Fetching**: Axios
-   **Animations**: Framer Motion 12
-   **Icons**: Lucide React

## Component Logic
-   **Dashboard**: Primary view with search, region filtering, and responsive grid.
-   **Country Modal**: Detailed view with contextual data and regional insights.
-   **Data Source**: Synchronized with `restcountries.com/v3.1/all`.

## Performance Optimization
-   Viewport-aware animation staggering via Framer Motion.
-   Efficient sorting and filtering logic on API-delivered datasets.
-   Modern Vite-driven asset bundling.
