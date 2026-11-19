# Spec: Calorie Tracker (stocky)

## 1. Overview

A mobile-first, MyFitnessPal-style calorie tracking web app. Users log in, record what they eat across four daily meal categories (Breakfast, Lunch, Dinner, Snacks), and see their running calorie total against a personal daily goal. Food items a user creates are saved to their personal library so they can be logged again on future days without re-entering the details. The app also supports simple body weight logging with a trend view.

Target platform: responsive web app, designed mobile-first (single column, bottom navigation, large touch targets), usable on desktop as a secondary experience.

## 2. Tech stack

- **Frontend**: Vue 3 (`rc` channel, per the existing `stocky/package.json`), Vite, Vue Router, Pinia (or similar) for client-side state.
- **Auth**: Firebase Authentication (email/password as the v1 method).
- **Database**: Firestore.
- **Hosting**: Firebase Hosting, serving the Vite production build (`npm run build` → `dist/`).

The existing scaffold conventions in `stocky/CLAUDE.md` (no semicolons, single quotes, 100-column Prettier, `@` → `src/` alias) apply once implementation starts; they don't affect this spec.

## 3. User flows

### 3.1 Sign up / login / logout
- New user signs up with email + password (Firebase Auth creates the account).
- Returning user logs in with email + password.
- Logout clears the session and returns to the login screen.
- Auth state persists across reloads (Firebase's default persistence).

### 3.2 First-time setup
- Immediately after first signup, prompt the user to set a **daily calorie goal** (manual number entry, e.g. 2000 kcal).
- Optionally prompt for a starting weight entry (can be skipped and added later from Weight Tracker).
- This writes the user's profile doc (see §4) before they reach the main app.

### 3.3 Daily Log (home screen)
- Shows the current date, with simple back/forward navigation to view adjacent days.
- Four meal sections in fixed order: **Breakfast, Lunch, Dinner, Snacks**.
- Each section lists the food entries logged under it for the selected date, with name, quantity, and calories.
- A running **total calories for the day** is shown, compared against the user's daily goal (e.g. "1,450 / 2,000 kcal" with a simple progress bar).
- Each meal section has an "Add food" action.

### 3.4 Add food to a meal
Two entry paths, both landing in the same "Add Food" screen/modal for a selected meal:

**a. Create new food item**
- User enters a name and calories-per-serving.
- On save: the item is added to the user's personal food library (§4 `foodItems`) **and** immediately logged as an entry in the selected meal for the selected date.

**b. Search existing item**
- User searches by name over their own personal food library only (no external or shared database).
- User selects a match, enters a **quantity/multiplier** (e.g. 1.5 servings), and confirms.
- Calories logged = `caloriesPerServing × quantity`, logged as a new entry in the selected meal for the selected date.

### 3.5 Edit / delete a logged entry
- From the Daily Log, the user can edit the quantity of an existing entry or delete it entirely.
- Editing/deleting only affects that day's log entry, not the underlying food library item.

### 3.6 Manage personal food library
- A dedicated "Food Library" screen lists all food items the user has ever created, with search/filter by name.
- User can edit a food item's name/calories, or delete it from the library.
- Editing or deleting a library item does **not** retroactively change past logged entries — each logged entry stores its own snapshot of name + calories at the time it was logged (see §4).

### 3.7 Weight tracking
- User can log a weight entry (date, defaulting to today, + value).
- A "Weight Tracker" screen shows entries as a simple list (most recent first) and a trend line chart (e.g. last 30/90 days).
- No goal weight or progress-toward-goal feature in v1 — just log and view trend.

### 3.8 Settings
- Edit daily calorie goal.
- Logout.

## 4. Data model (Firestore)

```
users/{uid}
  - displayName
  - dailyCalorieGoal   (number)
  - createdAt

users/{uid}/foodItems/{itemId}
  - name
  - caloriesPerServing (number)
  - createdAt

users/{uid}/entries/{entryId}
  - date               (YYYY-MM-DD string, for simple range queries)
  - meal               ("breakfast" | "lunch" | "dinner" | "snack")
  - foodItemId         (ref to foodItems, nullable — item may later be deleted)
  - name               (snapshot at time of logging)
  - caloriesPerServing (snapshot at time of logging)
  - quantity           (number)
  - calories           (computed: caloriesPerServing × quantity, stored for easy aggregation)
  - createdAt

users/{uid}/weightEntries/{entryId}
  - date               (YYYY-MM-DD string)
  - weightValue        (number)
  - createdAt
```

A flat `entries` collection (filtered by `date` field) is recommended over a nested `logs/{dateId}/entries` subcollection — it's simpler to query across date ranges (e.g. for future history views) and avoids managing empty parent "day" documents.

**Security rules**: every read/write under `users/{uid}/...` must require `request.auth != null && request.auth.uid == uid`. No cross-user reads are permitted anywhere.

## 5. Screens / pages

| Screen | Purpose |
|---|---|
| Login / Signup | Firebase Auth email+password forms |
| Daily Log (home) | Default view after login; 4 meal sections, daily total vs. goal, date navigation |
| Add Food | Modal/page with "Create new" and "Search existing" tabs, reached from a meal section |
| Food Library | Browse/search/edit/delete personal saved food items |
| Weight Tracker | Log weight, view list + trend chart |
| Settings | Edit calorie goal, logout |

Mobile-first layout: single column, bottom navigation bar (Daily Log / Food Library / Weight / Settings), large tap targets, modals/sheets for Add Food rather than full navigation where practical.

## 6. Out of scope for v1

- Macronutrients (protein/carbs/fat) — calories only.
- External or shared/community food databases — user's own entries only.
- Water intake tracking.
- Social features (friends, feed, sharing).
- Exercise/activity tracking.
- Barcode scanning.
- Goal weight / weight-loss progress projections.
- BMR/TDEE calculators for suggesting a calorie goal — goal is entered manually.
- Native mobile apps (this is a mobile-first responsive **web** app only).

## 7. Coding standards & component architecture

### Folder structure

```
src/
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
- **Feature components** (`components/food/`, `components/weight/`) own one piece of domain UI (e.g. `MealSection`, `WeightChart`) and may use `ui/` components internally, but never directly call Firestore — they receive data/handlers via props and emits, or call a composable.
- **UI components** (`components/ui/`) are generic and reusable across features — no knowledge of "food" or "weight" domain concepts. If the same markup/behavior (buttons, modals, form inputs, progress bars, list rows) appears in two or more places, extract it here before duplicating.
- **Composables own logic, not components.** Firestore reads/writes, derived state (e.g. daily total calories), and cross-component reactive state live in `composables/` or `stores/`, not inside component `<script setup>` blocks, so the same logic can be reused by multiple components/views.
- **Services are the only layer that touches the Firebase SDK.** Components and composables call `services/*` functions; they never import `firebase/firestore` or `firebase/auth` directly. This keeps Firebase swappable/mockable and keeps query logic in one place.
- Favor small, single-responsibility components over large ones. If a component's `<template>` needs scrolling to read fully, look for a natural split.

### Vue style conventions

- Use `<script setup>` with the Composition API for all components (matches Vue 3 + Vite scaffold defaults).
- Component filenames: `PascalCase.vue` (e.g. `MealSection.vue`); composables: `camelCase.js` prefixed with `use` (e.g. `useDailyLog.js`).
- Props: declare with `defineProps` and explicit types/defaults; avoid mutating props — emit events for parent updates instead.
- Keep template logic minimal — computed properties and methods over inline expressions beyond simple property access.
- Use the `@` alias (already configured) for all cross-folder imports instead of relative `../../..` paths.
- Follow existing Prettier config as-is: no semicolons, single quotes, 100-column width. Run `npm run format` before committing.

## 8. Open questions / assumptions

- **Auth method**: assuming email/password only for v1; Google sign-in could be added later with minimal extra work if wanted.
- **Weight unit**: spec assumes a single unit (e.g. lb) is fine for v1 rather than a user-selectable lb/kg toggle — confirm if a toggle is needed.
- **Timezone**: "today" is assumed to be based on the user's local device date (`YYYY-MM-DD` in local time), not UTC or a stored timezone preference.
- **History browsing**: Daily Log supports simple back/forward day navigation; no calendar picker or multi-day summary view is assumed necessary for v1.
