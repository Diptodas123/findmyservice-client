# FindMyService Client

A modern React (Vite) frontend for discovering, comparing, and booking local service providers (e.g., plumbing, cleaning, tutoring). It includes search, filtering, provider profiles, booking cart, user profiles, and a provider dashboard.

## Overview

- Fast, responsive UI using React + Vite
- Global theming with light/dark mode
- Modular components for home, search, provider details, and dashboard
- Redux Toolkit slices for `user`, `cart`, `search`, and `provider` state
- API client abstraction for service calls

## Tech Stack

- React 18 + Vite
- Redux Toolkit
- CSS modules and plain CSS files
- Cloudinary (images), Toast utilities
- ESLint (flat config)

## Getting Started

1) Install dependencies

```bash
npm install
```

2) Run the dev server

```bash
npm run dev
```

3) Build for production

```bash
npm run build
```

4) Preview the production build

```bash
npm run preview
```

## Project Scripts

- `dev`: Start Vite dev server
- `build`: Build production bundle
- `preview`: Preview built assets locally
- `lint`: Run ESLint (if configured in `package.json`)

## Configuration

Key config files and utilities:

- `src/config/config.js`: Central app configuration (API base URLs, feature flags)
- `src/utils/apiClient.js`: Axios/fetch wrapper for API calls
- `src/utils/serviceAPI.js`: Higher-level API methods used by pages/components
- `src/utils/cloudinary.js`: Cloudinary helpers for image URLs
- `src/utils/toastMessage.js`: Toast notifications

Environment variables (commonly used):

- `VITE_API_BASE_URL`: Backend API base URL
- `VITE_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name

Add them to a `.env` file at the project root:

```bash
VITE_API_BASE_URL=https://api.example.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## App Structure

High-level folders:

- `src/App.jsx`: App shell and route composition
- `src/main.jsx`: React root and provider setup
- `src/components/*`: Reusable UI components (banner, carousels, cards)
- `src/pages/*`: Route-level pages (Home, Search, Details, Dashboard)
- `src/store/*`: Redux Toolkit slices and store configuration
- `src/theme/*`: Theming utilities and context
- `src/utils/*`: API, formatting, navigation helpers
- `public/`: Static assets

Notable pages:

- `pages/Home/HomePage.jsx`: Landing page with featured listings and sections
- `pages/Search/Search.jsx`: Search results grid + sidebar filters
- `pages/ServiceProviderDetails/*`: Provider profile, photos, reviews, services
- `pages/ServiceDetails/ServiceDetails.jsx`: Individual service detail
- `pages/Cart/Cart.jsx`: Booking cart and checkout flow
- `pages/Profile/*`: User profile and sidebar
- `pages/ProviderDashboard/*`: Provider-facing dashboard (analytics, services, bookings, reviews, reports)

State management:

- `store/store.js`: Configures Redux store
- `store/userSlice.js`: Authentication/user profile state
- `store/cartSlice.js`: Cart items and totals
- `store/searchSlice.js`: Search query, filters, results
- `store/providerSlice.js`: Provider dashboard state

## Development Notes

- Routing: Ensure your router configuration in `App.jsx` maps to all pages above.
- Theming: `theme/theme.js` and `theme/themeModeContext.jsx` control color tokens and mode.
- Mock data: `mockData.js` can be used during development when backend is unavailable.
- Images: Use `utils/cloudinary.js` to construct optimized Cloudinary URLs.

## Testing

### Install Playwright Browsers
```bash
npx playwright install
```

### Unit & Integration Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### E2E Tests
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed

# Run specific test file
npx playwright test e2e/profile.spec.js
```

### Debugging Tests
```bash
# Debug Vitest tests with UI
npm run test:ui

# Debug Playwright tests
npx playwright test --debug

# Run Playwright with headed browser
npm run test:e2e:headed
```

## Contributing

1) Create a feature branch
2) Make focused changes with clear commits
3) Run `npm run lint` and `npm run build` to validate
4) Open a PR with a concise summary

## License

This project’s license is not yet specified. If you intend to open-source, add an SPDX-compatible license file (e.g., MIT) and reference it here.
