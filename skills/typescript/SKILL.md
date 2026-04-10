---
name: typescript
description: Use when editing TypeScript sources, tsconfig, or TSLint rules for this repo.
---

# TypeScript – DataSync Content Store MongoDB

## When to use

- Adding or refactoring `src/**/*.ts`
- Changing compiler or lint behavior
- Aligning new code with existing strictness

## Instructions

### Layout

- **Source:** `src/` only (`tsconfig.json` `"include": ["src/**/*"]`).
- **Output:** `dist/` JavaScript; **declarations:** `typings/` (`declarationDir`).
- **Types:** `src/types/` available via `paths` in `tsconfig.json` for ambient/custom typings.

### Compiler expectations

- Notable flags: `strict`-style checks (`alwaysStrict`, `noImplicitReturns`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`), `module` CommonJS, `target` ES6, `moduleResolution` node.

### Lint

- **TSLint** 5.x with `tslint.json`; scope matches `npm run tslint` (`src/**/*.ts` only). No Prettier or ESLint in `package.json` — do not introduce parallel formatters unless the team adopts them repo-wide.
