---
name: mongodb-content-store
description: Use for the public module API, DataSync integration, and MongoDB-related configuration for this content store.
---

# MongoDB content store – DataSync Content Store MongoDB

## When to use

- Changing how the package is consumed by DataSync Manager
- Working on `start`, config validation, or the `Mongodb` data layer
- Adjusting connection behavior or stored document shape

## Instructions

### Entry and public surface

- **Package entry:** `src/index.ts` → built to `dist/index.js` (`package.json` `"main"`).
- **Exported functions:** `setAssetConnector`, `setConfig`, `getConfig`, `getMongoClient`, `start` — these are the integration surface for DataSync (see JSDoc in `src/index.ts`).
- **Implementation:** Connection in `src/connection.ts`; store logic in `src/mongodb.ts`; defaults and merging in `src/config.ts` and `src/util/`.

### Integration pattern

- Callers pass an **asset connector** instance and optional merged config, then `start()` resolves with a **MongoDB client wrapper** used for publish/unpublish/delete flows. Do not assume this repo runs its own HTTP server.

### Configuration

- User-facing options (database name, collection names, URI, indexes, `unwantedKeys`, driver `options`) are documented in the root **README.md** — treat that as the product contract; code changes should stay consistent with those tables.

### Boundaries

- This package depends on **`mongodb`** and **lodash**; it does not bundle the webhook listener or manager — those live in sibling Contentstack repos.
- Platform context: [Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync) (how this module fits the larger sync stack).
