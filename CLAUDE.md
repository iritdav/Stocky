# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout

The git root contains a single app, `stocky/` (Vue + Vite, freshly scaffolded from the `create-vue` template). Run all npm commands from `stocky/`.

## Commands

```sh
npm install        # requires Node ^22.18.0 or >=24.12.0
npm run dev        # Vite dev server with HMR (includes vite-plugin-vue-devtools)
npm run build      # production build to dist/
npm run preview    # serve the production build
npm run format     # prettier --write on src/
npm run test       # vitest run (unit tests, src/**/*.test.js)
npm run test:watch # vitest in watch mode
```

Vitest covers pure logic in `src/utils/`; there is no component-test setup or linter configured yet.

## Notes

- Uses the **Vue release-candidate** (`"vue": "rc"`); `package.json` `overrides` pins all `@vue/*` packages (including `compiler-vapor` and `runtime-vapor`) to `rc` too. Keep them in sync when changing Vue dependencies.
- Entry point: `src/main.js` mounts `src/App.vue` on `#app` and imports `src/assets/main.css`. `src/components/` is still the template's welcome/demo content (HelloWorld, TheWelcome, icons).
- `@` aliases `src/` (configured in both `vite.config.js` and `jsconfig.json`).
- Prettier style: no semicolons, single quotes, 100-column width.
- See `spec.md` at the repo root for the product spec (flows, Firestore data model) for the calorie-tracking app being built in this repo.

## Coding standards & component architecture

### Folder structure (`src/`)

```
assets/            # global CSS, static images
components/
  ui/              # generic, app-agnostic building blocks (Button, Input, Modal, ProgressBar, Card)
  food/            # feature components for food/meal logging (MealSection, FoodListItem, FoodSearchForm, FoodCreateForm)
  weight/          # feature components for weight tracking (WeightEntryForm, WeightChart, WeightList)
composables/       # reusable reactive logic (useAuth, useDailyLog, useFoodLibrary, useWeightEntries)
views/             # one component per route (LoginView, DailyLogView, FoodLibraryView, WeightTrackerView, SettingsView)
router/            # vue-router config
stores/            # Pinia stores (auth, dailyLog, foodLibrary, weight)
services/          # Firebase access (firebase.js init, auth.js, firestore.js per-collection helpers)
utils/             # pure helper functions (date formatting, calorie math)
```

### Component hierarchy & reuse

- **Views are thin.** A `views/*View.vue` composes feature components and wires up composables/stores; it holds no business logic and minimal markup of its own.
- **Feature components** (`components/food/`, `components/weight/`) own one piece of domain UI and may use `ui/` components internally, but never call Firestore directly — they receive data/handlers via props and emits, or call a composable.
- **UI components** (`components/ui/`) are generic and reusable across features — no domain knowledge. If the same markup/behavior appears in two or more places, extract it here before duplicating.
- **Composables own logic, not components.** Firestore reads/writes, derived state, and cross-component reactive state live in `composables/` or `stores/`, not inside component `<script setup>` blocks.
- **Services are the only layer that touches the Firebase SDK.** Components and composables call `services/*` functions; never import `firebase/firestore` or `firebase/auth` directly elsewhere.
- Favor small, single-responsibility components. If a `<template>` needs scrolling to read fully, look for a natural split.

### Vue style conventions

- Use `<script setup>` with the Composition API for all components.
- Component filenames: `PascalCase.vue`; composables: `camelCase.js` prefixed with `use` (e.g. `useDailyLog.js`).
- Declare props with `defineProps` and explicit types/defaults; never mutate props — emit events instead.
- Prefer computed properties/methods over inline template expressions beyond simple property access.
- Use the `@` alias for cross-folder imports instead of relative `../../..` paths.
- Run `npm run format` before committing.
