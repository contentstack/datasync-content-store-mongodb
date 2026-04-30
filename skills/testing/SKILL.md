---
name: testing
description: Use for Jest tests, fixtures under test/, and coverage settings for this package.
---

# Testing – DataSync Content Store MongoDB

## When to use

- Adding or fixing tests
- Changing `jest.config.js` or mock data
- Interpreting coverage output

## Instructions

### Layout

- **Tests:** `test/**/*.ts` (see `testMatch` in `jest.config.js`).
- **Ignored paths:** `test/mock/*`, `test/mongo.setup.ts` from normal test discovery (`testPathIgnorePatterns`).
- **Mocks:** `test/mock/` — config, asset store, sample entries/assets/content types.

### Runner

- **Preset:** `ts-jest`; **environment:** `node`.
- **Coverage:** Enabled (`collectCoverage: true`); reports under `coverage/` (HTML + JSON). Adjust thresholds in `jest.config.js` only if the team agrees.

### Running

- Use `npm test` (includes compile via `pretest`). For watch mode, use `npx jest --watch` if needed locally (not defined as an npm script).

### Credentials

- Tests should use mock config and local/test URIs — do not embed production MongoDB credentials in the repo.
