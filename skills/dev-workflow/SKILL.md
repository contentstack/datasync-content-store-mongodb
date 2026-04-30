---
name: dev-workflow
description: Use for branches, npm scripts, CI, releases, and local dev setup for this package.
---

# Dev workflow – DataSync Content Store MongoDB

## When to use

- Running or changing build, test, or lint
- Understanding what runs on push or release
- Setting expectations for PRs against this repo

## Instructions

### Commands

- **Build:** `npm run build-ts` — runs `clean` then `compile` (`tsc -b tsconfig.json`). Artifacts: `dist/`, `typings/`.
- **Test:** `npm test` — `pretest` runs `clean` + `compile`, then Jest (`jest.config.js`).
- **Lint:** `npm run tslint` — `npx tslint -c tslint.json 'src/**/*.ts'`.
- **Watch compile:** `npm run watch-ts` when iterating on TypeScript only.

### CI and release

- **npm publish path:** `.github/workflows/release.yml` runs on push to **`master`**: `npm install`, `npm run build-ts`, then publish with `JS-DevTools/npm-publish`.
- **Legacy:** `.travis.yml` runs `build-ts` and `test` with a MongoDB service (older Node matrix); prefer matching local Node to README (20+) or workflow (22.x) when debugging CI drift.
- **Other workflows:** `.github/workflows/` includes CodeQL, SCA, policy scans — consult those files for triggers.

### PR expectations

- Keep changes scoped; run **build**, **test**, and **tslint** before opening a PR.
- Do not commit `dist/` or generated coverage unless the project convention changes (published package includes `/dist` and `/typings` per `package.json` `files`).
