# Rosenkrans (SvelteKit)

Minimal, production-ready SvelteKit site in JavaScript, prepared for Vercel deployment.

## Requirements

- Node.js `22.12+` (recommended LTS)
- npm `10+`

## Local Development

```sh
npm install
npm run dev
```

Optional:

```sh
npm run dev -- --open
```

## Production Build

```sh
npm run build
npm run preview
```

## Deploy To Vercel

This project uses `@sveltejs/adapter-vercel`.

1. Push to GitHub.
2. Import the repository in Vercel.
3. Vercel will detect SvelteKit automatically.
4. Use default build command (`npm run build`) and output settings.

## Where To Edit Content

- Source material: `rosenkransen.md`
- Content parser + structured data mapping: `src/lib/content/rosaryContent.js`
- Main page composition: `src/routes/+page.svelte`
- Reusable UI pieces:
  - `src/lib/components/Accordion.svelte`
  - `src/lib/components/ToggleGroup.svelte`
  - `src/lib/components/StatueVisual.svelte`

## Where To Edit Design

- Global variables and base theme: `src/app.css`
- Page-level layout and section styles: `src/routes/+page.svelte`
- Component-scoped styles inside each component file
