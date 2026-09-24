# Source uploads and deployment

Source repository: [Benaridor2/Nexa-AI-Website](https://github.com/Benaridor2/Nexa-AI-Website).

The user has authorized uploading each completed website version to this repository's `main` branch. Build and verify the completed version, then upload its source while respecting current branch protection rules. This replaces the earlier ZIP-only workflow. Do not create deployment timers or watchers.

## Primary workflow: GitHub

1. Confirm that `origin` points to the repository above. The destination/default branch is `main`. Inspect the current branch, remote history, and protection rules before pushing; do not overwrite existing work.
2. Install the locked dependencies with `npm ci` and run `npm run build`. Complete the browser and interaction checks appropriate to the changes, including the prototype's booking-location and explicit-confirmation boundaries.
3. Commit the completed source changes, assets, lockfile, and configuration. Exclude credentials, environment files, local deployment metadata, dependencies, generated build output, QA artifacts, and release archives.
4. Push through the permitted workflow. When direct pushes are allowed, use `git push origin HEAD:main`; this explicitly targets `main` even when local work remains on `codex/v2-cinematic`. If branch protection requires a feature branch and pull request, use that path instead. Never force push, bypass protection, or replace remote history. Reconcile a rejected non-fast-forward push before retrying.
5. Verify the uploaded commit and report its repository/commit link. Source upload and website deployment are separate outcomes.

The GitHub integration is confirmed: pushes to `main` feed production deployments in the existing Vercel project `nexa-ai`. The primary live URL is [nexa-ai-delta-three.vercel.app](https://nexa-ai-delta-three.vercel.app). For every completed version, verify that Vercel reports a successful deployment for the exact uploaded commit, then check the production URL, direct `/v1` reload, assets, and published booking journey. A successful push alone does not establish that a later deployment succeeded.

## Current homepage

V3 serves the complete homepage at `/`. V1 and V2 remain available at `/v1` and `/v2`; both have explicit Vercel rewrites for direct visits. V3 requires no WebGL, backend, or environment variables. Verify the current source commit's deployment after each push. The optional ZIP below is an older V2 snapshot, not the current V3 release.

## Initial production record (V2)

On 2026-09-25, commit [517ca6546b7645a40c0a0b902dbd08eee46f52dd](https://github.com/Benaridor2/Nexa-AI-Website/commit/517ca6546b7645a40c0a0b902dbd08eee46f52dd) was uploaded to `main`. Vercel automatically created production deployment `dpl_3aTnw4yPidkZczo7nxTRDVmx42bh`, with source `git`, matching commit metadata, and state **READY**. Its aliases are `nexa-ai-delta-three.vercel.app` and `nexa-ai-nexaai2.vercel.app`.

Hosted browser smoke checks passed on the production alias: desktop and 390 x 844 responsive mobile playback reached the unconfirmed property website, the explicit confirmation action displayed the illustrative PMS receipt, and a direct `/v1` navigation loaded the preserved version. Images and typography rendered, and no browser console warnings or errors were reported during these checks. Mobile verification used a responsive viewport, not a physical handset.

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

Update the production record with actual upload, deployment, and verification results for each completed version. Do not assume that future pushes or builds will succeed because the initial deployment did.
