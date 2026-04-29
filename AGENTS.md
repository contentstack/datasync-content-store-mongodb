# DataSync Content Store MongoDB – Agent guide

**Universal entry point** for contributors and AI agents. Detailed conventions live in **`skills/*/SKILL.md`**.

## What this repo is

| Field | Detail |
| --- | --- |
| **Name:** | [contentstack/datasync-content-store-mongodb](https://github.com/contentstack/datasync-content-store-mongodb) (`@contentstack/datasync-content-store-mongodb` on npm) |
| **Purpose:** | TypeScript library that implements Contentstack DataSync’s MongoDB content store: persist synced entries, assets, and schema data from the webhook/sync pipeline. |
| **Out of scope (if any):** | Not a standalone HTTP server or CLI; it is loaded by DataSync Manager with an asset store and listener. Product usage and config tables stay in the root **README.md**. |

## Tech stack (at a glance)

| Area | Details |
| --- | --- |
| Language | TypeScript (see `tsconfig.json`; target ES6, CommonJS) |
| Build | `tsc -b` via `npm run compile`; output `dist/`, declarations `typings/` |
| Tests | Jest + ts-jest; tests under `test/**/*.ts` (`jest.config.js`) |
| Lint / coverage | TSLint (`tslint.json`, `npm run tslint`); Jest collects coverage to `coverage/` (HTML + JSON) |
| Other | Node; MongoDB driver `mongodb` ^6.x; runtime per `package.json` `engines` (README recommends Node 20+) |

## Commands (quick reference)

| Command type | Command |
| --- | --- |
| Build | `npm run build-ts` |
| Test | `npm test` |
| Lint | `npm run tslint` |

CI / automation: `.github/workflows/release.yml` (build and publish on `master`); `.travis.yml` (legacy Node + MongoDB service + test); other workflows under `.github/workflows/` for scans and tooling.

## Where the documentation lives: skills

| Skill | Path | What it covers |
| --- | --- | --- |
| Dev workflow | [`skills/dev-workflow/SKILL.md`](skills/dev-workflow/SKILL.md) | Branches, scripts, CI touchpoints, PR expectations |
| MongoDB content store API | [`skills/mongodb-content-store/SKILL.md`](skills/mongodb-content-store/SKILL.md) | Public exports, DataSync integration, config surface |
| TypeScript conventions | [`skills/typescript/SKILL.md`](skills/typescript/SKILL.md) | Layout, compiler flags, lint scope |
| Testing | [`skills/testing/SKILL.md`](skills/testing/SKILL.md) | Jest layout, mocks, coverage |
| Code review | [`skills/code-review/SKILL.md`](skills/code-review/SKILL.md) | Review checklist for this repo |

An index with “when to use” hints is in [`skills/README.md`](skills/README.md).

## Using Cursor (optional)

If you use **Cursor**, [`.cursor/rules/README.md`](.cursor/rules/README.md) only points to **`AGENTS.md`**—same docs as everyone else.
