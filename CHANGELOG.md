# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-11-26

### 🚀 Major Updates

#### Upgraded to Next.js 15 & React 19
- **Next.js**: 14.0.4 → 15.0.3
- **React**: 18.2.0 → 19.0.0
- **React DOM**: 18.2.0 → 19.0.0

#### Dependency Updates
- **TypeScript**: 5.3.3 → 5.6.0
- **@types/react**: 18.2.45 → 19.0.0
- **@types/react-dom**: 18.2.18 → 19.0.0
- **@types/node**: 20.10.5 → 22.0.0
- **@cloudflare/next-on-pages**: 1.7.0 → 1.13.0
- **ESLint**: 8.56.0 → 9.0.0
- **eslint-config-next**: 14.0.4 → 15.0.3
- **PostCSS**: 8.4.32 → 8.4.47
- **TailwindCSS**: 3.4.0 → 3.4.14
- **Wrangler**: 3.0.0 → 3.80.0
- **Chart.js**: 4.4.0 → 4.4.1
- **UUID**: 9.0.0 → 10.0.0
- **clsx**: 2.0.0 → 2.1.0

### ✨ New Features

#### Next.js 15 Enhancements
- **Turbopack**: Faster development builds (automatic in dev mode)
- **Enhanced Caching**: More efficient cache strategies
- **Improved Static Generation**: Better static site generation
- **Performance**: Build and runtime performance improvements

#### React 19 Features
- **Actions Support**: Server actions and form integration ready
- **Optimistic Updates**: Support for optimistic UI updates
- **New Hooks**: useOptimistic, useFormStatus available
- **Improved Suspense**: Better async handling

### 🔧 Configuration Changes

#### next.config.js
- Added `reactStrictMode: true`
- Added compiler optimizations
- Configured `removeConsole` for production builds
- Prepared for experimental features

#### Metadata Enhancements
- Added Open Graph metadata
- Added SEO optimization tags
- Updated keywords with Next.js 15 and React 19
- Added authors and publisher information

### 📚 Documentation

#### README.md Updates
- Updated all version numbers
- Added Next.js 15 & React 19 features section
- Documented new capabilities
- Updated technical stack information
- Added version information table

### 🔄 Breaking Changes

#### Type Definitions
- React 19 type definitions may require code adjustments
- Some component prop types have been refined

#### Peer Dependencies
- Node.js 18+ is now required
- Some tooling may need updates for compatibility

### 📦 Migration Guide

To upgrade an existing project:

```bash
# Update package.json dependencies
npm install next@^15.0.3 react@^19.0.0 react-dom@^19.0.0

# Update dev dependencies
npm install -D @types/react@^19.0.0 @types/react-dom@^19.0.0 typescript@^5.6.0

# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install

# Run development server
npm run dev
```

### 🐛 Bug Fixes
- Fixed compatibility issues with Cloudflare Pages adapter
- Updated type definitions for better type safety
- Improved build configuration for static exports

### 🎯 Performance
- Faster development server startup
- Improved build times with Turbopack
- Optimized production bundles
- Better tree-shaking

### 📝 Notes

This is a major version update that brings significant improvements in:
- Development experience with Turbopack
- Type safety with React 19 types
- Performance optimizations
- Modern toolchain support

All existing functionality has been preserved and enhanced.

---

## [1.0.0] - 2025-11-26

### Initial Release

- Next.js 14 implementation with App Router
- React 18 with Hooks
- TypeScript integration
- TailwindCSS styling
- Chart.js data visualization
- API Routes for simulation logic
- Cloudflare Pages deployment support
- Complete MSP revenue simulator functionality
