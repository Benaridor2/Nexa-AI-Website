// Saves the Sea N' Rent listing photos next to the site before each build.
// Runs as `prebuild` (for example on Vercel). It never fails the build: a
// photo that cannot be fetched is skipped, and the page then loads it from
// the listing's CDN URL instead (see ListingImage in src/v6/Scenes.tsx).
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await readFile(join(root, 'src/v6/listings.json'), 'utf8'));
const jobs = data.listings.flatMap(listing => listing.photos.map((src, i) => ({ src, file: join(root, 'public/seanrent/tel-aviv', listing.key, `${i + 1}.jpg`) })));

const exists = file => access(file).then(() => true, () => false);
const fetchPhoto = async ({ src, file }) => {
  const response = await fetch(src, { signal: AbortSignal.timeout(15000) });
  const type = response.headers.get('content-type') || '';
  if (!response.ok || !type.startsWith('image/')) throw new Error(`${response.status} ${type}`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, Buffer.from(await response.arrayBuffer()));
};

const missing = [];
for (const job of jobs) if (!(await exists(job.file))) missing.push(job);
if (!missing.length) { console.log(`listing photos: all ${jobs.length} present`); process.exit(0); }

// One quick probe first, so a build without network access does not wait on every photo.
try { await fetchPhoto(missing[0]); missing.shift(); }
catch (error) { console.warn(`listing photos: skipped, CDN unreachable (${error.message}); pages fall back to the CDN URLs`); process.exit(0); }

let saved = 1, failed = 0;
for (let i = 0; i < missing.length; i += 6) {
  const results = await Promise.allSettled(missing.slice(i, i + 6).map(fetchPhoto));
  for (const result of results) result.status === 'fulfilled' ? saved++ : failed++;
}
console.log(`listing photos: saved ${saved}, failed ${failed}, already present ${jobs.length - saved - failed}`);
