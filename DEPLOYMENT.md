# Source uploads and deployment

Source repository: [Benaridor2/Nexa-AI-Website](https://github.com/Benaridor2/Nexa-AI-Website).

The user has authorized uploading each completed website version to this repository's `main` branch. Build and verify the completed version, then upload its source while respecting current branch protection rules. This replaces the earlier ZIP-only workflow. Do not create deployment timers or watchers.

## Primary workflow: GitHub

1. Confirm that `origin` points to the repository above. The destination/default branch is `main`. Inspect the current branch, remote history, and protection rules before pushing; do not overwrite existing work.
2. Install the locked dependencies with `npm ci` and run `npm run build`. Complete the browser and interaction checks appropriate to the changes, including the prototype's booking-location and explicit-confirmation boundaries.
3. Commit the completed source changes, assets, lockfile, and configuration. Exclude credentials, environment files, local deployment metadata, dependencies, generated build output, QA artifacts, and release archives.
4. Push through the permitted workflow. When direct pushes are allowed, use `git push origin HEAD:main`; this explicitly targets `main` even when local work remains on `codex/v2-cinematic`. If branch protection requires a feature branch and pull request, use that path instead. Never force push, bypass protection, or replace remote history. Reconcile a rejected non-fast-forward push before retrying.
5. Verify the uploaded commit and report its repository/commit link. Source upload and website deployment are separate outcomes.

GitHub pushes trigger Vercel deployments only if the GitHub integration is connected and the pushed branch matches that project's deployment rules. That connection has not yet been verified in this workflow; do not claim that a push has published the website. If an integration is configured, verify the resulting deployment status and URL, direct `/v1` reload, assets, and the published booking journey before reporting it as live.

## Optional fallback: manual ZIP upload

Use this fallback when a manual upload is needed. The prepared V2 archive is `releases/NEXA-V2-Vercel.zip`; it is a snapshot and must be rebuilt if later source changes need to be included.

1. Open https://vercel.com/drop.
2. Drag the ZIP onto the page without unzipping it.
3. Choose your Vercel team, name the new project `nexa-v2`, and click Deploy.
4. If a homepage is requested, select `index.html`.

The archive contains the source project, assets, locked dependencies, and Vercel configuration. Vercel builds the project as Vite with `npm ci`, `npm run build`, Node 24, and output directory `dist`. No environment variables are required. The homepage is V2; `/v1` preserves V1 for comparison.

Each Vercel Drop upload creates a NEW project and URL. It does not overwrite the existing NEXA project. Use the configured GitHub/Vercel integration when updates should retain an existing project and production URL.

Official upload behavior: [Deploy to Vercel without Git](https://vercel.com/i/deploy-to-vercel-without-git).

### Packaging rules

Build successfully before packaging. Include package.json, package-lock.json, tsconfig.json, index.html, vercel.json, .vercelignore, source files, and public assets at the ZIP root. Exclude node_modules, dist, .git, .vercel, .env files, reference files, QA files, previous archives, and local instructions. Verify archive integrity and required files before delivering it. Use a versioned filename and identify the exact ZIP to upload. Packaging is an optional handoff, not a substitute for the authorized GitHub upload workflow.

## Deployment audit

- Fixed direct `/v1` visits and refreshes with explicit index.html rewrites.
- Declared Vite build/output, npm ci, and Node 24 for repeatable builds.
- Added credential/deployment metadata exclusions.
- Immutable caching applies only to hashed `/assets` files. HTML and mutable public images keep default revalidation behavior.
- Asset and import filename case matches the repository.
- No backend, server secrets, or environment variables are required.
- npm audit reported zero known application dependency vulnerabilities on 2026-09-25.
- This is an illustrative prototype; booking/payment are not integrated.

Record actual upload and deployment results with each completed version. This document describes the workflow and does not establish that a particular commit is already uploaded or live.
