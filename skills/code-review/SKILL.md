---
name: code-review
description: Use when reviewing or preparing a PR for this repository.
---

# Code review – DataSync Content Store MongoDB

## When to use

- Authoring a PR
- Reviewing changes for merge readiness

## Instructions

### Checklist

- **Correctness:** Behavior matches DataSync content-store expectations (publish / unpublish / delete paths) and README configuration contract where applicable.
- **Build:** `npm run build-ts` succeeds; `dist/` and `typings/` stay consistent with source.
- **Tests:** `npm test` passes; new behavior has coverage where practical.
- **Lint:** `npm run tslint` clean for touched `src/**/*.ts`.
- **Scope:** No unrelated refactors or drive-by dependency churn unless justified.
- **Security / data:** No secrets; MongoDB options and sanitization remain safe for untrusted sync payloads.

### Severity (optional)

- **Blocker:** Breaks build, tests, or published API without semver alignment.
- **Major:** Behavioral regression, missing tests for risky logic, or doc/code mismatch on public config.
- **Minor:** Style nits, small refactors, non-user-facing cleanup.
