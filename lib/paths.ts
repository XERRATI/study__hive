/**
 * Base path helper — the app may be deployed at a subpath like
 * /study__hive (GitHub Pages). Use asset('/images/...') instead of a
 * bare '/images/...' src so images work both locally and on the site.
 */
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '')

export function asset(p: string): string {
  return basePath + (p.startsWith('/') ? p : '/' + p)
}
