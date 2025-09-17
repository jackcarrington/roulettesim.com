# SSR Enablement and Netlify Integration Report

Date: 2025-09-17

## Summary

We migrated the site to Server-Side Rendering (SSR) using Astro with the Netlify adapter and resolved build issues. All React components now render correctly under SSR on Netlify.

## Goals

- Enable SSR output mode in Astro.
- Configure Netlify adapter and environment for SSR.
- Fix build-time module resolution (Ajv) and Sass errors.
- Validate production build locally and push changes to trigger Netlify deploy.

## Changes Overview

- Enabled SSR in `astro.config.mjs` with `output: 'server'` and the `@astrojs/netlify` adapter.
- Replaced deprecated `@astrojs/netlify/functions` import with `@astrojs/netlify`.
- Added `ajv` to devDependencies to satisfy `ajv-errors` import used during build.
- Set Netlify Node.js version to stable LTS `20.18.1` in `netlify.toml`.
- Fixed Sass error in `src/components/education/EducationalCard.astro` by replacing invalid top-level parent selector usage.
- Validated production build locally.

## Files Modified

- `astro.config.mjs`
- `package.json`
- `netlify.toml`
- `src/components/education/EducationalCard.astro`

## Detailed Steps

### 1) Enable SSR in Astro and use Netlify adapter

File: `astro.config.mjs`

- Switched to SSR output mode.
- Selected Netlify adapter.
- Removed deprecated adapter import.

Code highlights:

```js
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  adapter: netlify({}),
  // ...rest unchanged
});
```

Previously (deprecated):

```js
import netlify from '@astrojs/netlify/functions'; // deprecated
```

### 2) Fix Ajv module error during Netlify build

File: `package.json`

- The build failed with `Cannot find module 'ajv/dist/compile/codegen'` (required by `ajv-errors`).
- Solution: add Ajv as a dev dependency so the build has the expected version available.

Code change:

```json
{
  "devDependencies": {
    "ajv": "^8.17.1"
  }
}
```

### 3) Standardize Node.js version for Netlify

File: `netlify.toml`

- Set Node to a stable LTS to avoid environment mismatches.

```toml
[build.environment]
NODE_VERSION = "20.18.1"
NPM_FLAGS = "--legacy-peer-deps"
```

### 4) Fix Sass top-level parent selector error

File: `src/components/education/EducationalCard.astro`

- Error: `Top-level selectors may not contain the parent selector "&"` caused by `.darkmode & { ... }` outside a nested context.
- Fix: Use a global selector targeting the dark mode class.

Before:

```scss
// Dark mode adjustments
.darkmode & {
  .educational-article {
    background: light-dark(var(--background-color), var(--color-neutral-900));
    border-color: light-dark(var(--border-color-subtle), var(--color-neutral-700));
    &:hover {
      border-color: light-dark(var(--color-primary-400), var(--color-primary-300));
      box-shadow: var(--elevation-2);
    }
  }
}
```

After:

```scss
// Dark mode adjustments
:global(.darkmode) .educational-article {
  background: light-dark(var(--background-color), var(--color-neutral-900));
  border-color: light-dark(var(--border-color-subtle), var(--color-neutral-700));
  &:hover {
    border-color: light-dark(var(--color-primary-400), var(--color-primary-300));
    box-shadow: var(--elevation-2);
  }
}
```

## Validation

### Local production build

- Ran `npm run build` locally after changes.
- Result: Build completed successfully with SSR and Netlify adapter.
- Notable warnings: `getStaticPaths()` ignored in dynamic pages under SSR. Safe to ignore for SSR, or add `export const prerender = true;` if you want those routes statically generated.

Dynamic routes with warnings:

- `src/pages/blog/[post].astro`
- `src/pages/blog/[...page].astro`
- `src/pages/games/[gameId].astro`
- `src/pages/strategy/[post].astro`

### Netlify

- With the above changes committed to `main`, Netlify will rebuild using Node `20.18.1`, include Ajv during build, and use the correct Netlify adapter for SSR.

## Commits

- `c20f306` — Fix build: replace top-level & with :global(.darkmode) selector; switch to @astrojs/netlify adapter import
- `7236104` — Fix Netlify build: add ajv, update Node to 20.18.1; refresh lockfile
- `eea6a6f` — Enable SSR with Netlify adapter; switch Astro output to 'server'; add new components/pages; update package/tsconfig

## Next Steps (Optional)

- If any dynamic routes should be statically generated, add `export const prerender = true;` at the top of the corresponding page files.
- Monitor Netlify deploy logs to confirm successful SSR deployment and test runtime paths.
- Consider moving `ajv` to `dependencies` if any runtime (not only build-time) code uses it. Currently devDependency is sufficient for build-time use.

## Notes

- Adapter import path `@astrojs/netlify/functions` is deprecated; using `@astrojs/netlify` avoids deprecation warnings and future breakage.
- The Sass change ensures selectors compile under the Dart Sass rules enforced by Astro's build pipeline.
