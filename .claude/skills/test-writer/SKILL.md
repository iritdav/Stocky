---
name: test-writer
description: Write Vitest unit tests for stocky (utils, Pinia stores, composables). Use when asked to add, update, or improve unit tests for this project.
---

# Test writer

stocky uses Vitest. Test files live alongside the source file they cover, named `*.test.js` (e.g. `src/utils/date.js` → `src/utils/date.test.js`).

There is no component-test setup or linter configured yet — write tests only for pure logic in `src/utils/`, Pinia stores in `src/stores/`, and composables in `src/composables/`. Don't add `.vue` component tests or introduce a new test runner/library.

## Before writing

Read the source file being tested and at least one existing `*.test.js` file in the same folder (`src/utils/calories.test.js` for utils, `src/stores/dailyLog.test.js` for stores) to match current style.

## Conventions

- Import from `vitest`: `describe`, `expect`, `it`, and `beforeEach`/`vi` when needed.
- One `describe` block per exported function or store; `it` blocks read as plain-English behavior statements ("rounds to the nearest whole calorie", "is a no-op for an unknown entry id").
- No semicolons, single quotes, 100-column width — match Prettier config. Run `npm run format` after writing tests.
- Use the `@` alias for imports from outside the current folder (e.g. `@/services/entries`), relative imports (`./calories`) within the same folder.

### Utils (`src/utils/`)

Pure functions — no mocking needed. Cover the normal case, a rounding/boundary case, and any branch (e.g. gender/flag-based formula switches). See `src/utils/calories.test.js`.

### Pinia stores (`src/stores/`)

- `beforeEach`: `setActivePinia(createPinia())` and `vi.clearAllMocks()`.
- Mock the store's `services/*` dependency with `vi.mock('@/services/<name>', () => ({ ... }))` placed before the store import, then import the mocked functions from that same path to set return values/assert calls.
- Test: initial/default state, computed/getter derivations, async actions (loading state transitions, correct service calls with correct args, state updates after resolution), and edge cases like no-op on an unknown id.
- Assert service calls with `toHaveBeenCalledWith` / `toHaveBeenLastCalledWith`; assert resulting store state with `toEqual`/`toMatchObject`.

See `src/stores/dailyLog.test.js` as the reference pattern.

### Composables (`src/composables/`)

Not yet present in the codebase — follow the same mocking approach as stores (mock `services/*`, assert reactive state and calls), calling the composable directly rather than mounting a component.

## After writing

1. Run `npx vitest run <path-to-new-test-file>` from `stocky/` and fix any failures.
2. Run `npm run format` from `stocky/`.
3. Run the full suite (`npm run test`) to confirm no regressions.
