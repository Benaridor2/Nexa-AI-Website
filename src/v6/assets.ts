// Where the photos and logos live. Empty on the site itself (same origin);
// the standalone builds (the annotated conversation as one HTML file) point it
// at the live site, so the file stays small and loads the photos from there.
export const ASSET_BASE: string = (import.meta.env.VITE_ASSET_BASE as string | undefined) ?? '';
