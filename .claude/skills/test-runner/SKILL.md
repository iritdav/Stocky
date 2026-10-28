---
name: test-runner
description: Run the stckyApp unit test suite (Vitest). Use when asked to run, check, or fix unit tests for this project.
---

# Test runner

stckyApp uses Vitest for unit tests. Test files live alongside source files as `*.test.js` (e.g. `src/utils/date.test.js`, `src/stores/auth.test.js`).

## Run all tests

```sh
cd stckyApp
npm run test
```

This runs `vitest run` — a single non-watching pass that exits with a non-zero code on failure.

## Run a single file or pattern

```sh
cd stckyApp
npx vitest run <path-or-pattern>
```

Example: `npx vitest run src/utils/calories.test.js`

## Watch mode (interactive, local dev only — do not use for one-shot checks)

```sh
cd stckyApp
npm run test:watch
```

## After making code changes

Run `npm run test` from `stckyApp/` and report failures with file:line references. If a test fails because of a genuine bug, fix the source (not the test) unless the test itself is wrong. Also run `npm run format` before considering a change complete, per project convention.
