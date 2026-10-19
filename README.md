# Leftengine 2.0.0

A small, modular browser-based engine foundation. This repository starts with a dependency-free TypeScript/HTML/CSS scaffold that can be extended into a 2D/3D editor, simulation engine, or game runtime.

## Current scope

- Responsive command-center style demo UI
- Engine lifecycle and typed configuration
- Basic entity/component scene model
- Lightweight event bus
- Build, lint, and test workflows
- GitHub Pages deployment for the static demo

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Development

```sh
npm install
npm run dev
```

## Validation

```sh
npm run typecheck
npm test
npm run build
```

## GitHub Pages

The Pages workflow builds the Vite site and deploys `dist/`. In repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

## Architecture

- `src/core`: engine lifecycle, events, and scene primitives
- `src/ui`: browser UI
- `src/styles`: design tokens and responsive layout
- `.github/workflows`: CI and Pages deployment

## Status

This is a foundation, not a finished production 3D engine. Rendering, asset import, persistence, and editor tools are intentionally isolated as future modules.
