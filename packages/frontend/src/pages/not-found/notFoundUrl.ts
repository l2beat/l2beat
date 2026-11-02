import { env } from '~/env'

export interface SectionIndex {
  name: string
  href: string
}

/**
 * The last path segment as a visitor would type it into search:
 * `/layer2s/projects/arbitrun-one.md` → "arbitrun one". Mistyped or renamed
 * project slugs are the most common 404, and the slug is the project's name.
 */
export function getSearchQueryFromUrl(url: string): string {
  const segment = getPathSegments(url).at(-1) ?? ''
  return safeDecode(segment)
    .replace(/\.[a-z]+$/i, '')
    .replace(/[-_\s]+/g, ' ')
    .trim()
}

/** The index of the section the URL is in, if that section has one. */
export function getSectionIndexFromUrl(url: string): SectionIndex | undefined {
  const [first] = getPathSegments(url)
  return first ? getSectionIndexes()[first] : undefined
}

function getSectionIndexes(): Record<string, SectionIndex | undefined> {
  return {
    layer2s: { name: 'Layer 2 summary', href: '/layer2s/summary' },
    interop: { name: 'Interop', href: '/interop/summary' },
    'zk-catalog': { name: 'ZK Catalog', href: '/zk-catalog' },
    privacy: { name: 'Privacy', href: '/privacy/summary' },
    publications: { name: 'Publications', href: '/publications' },
    governance: { name: 'Governance', href: '/governance' },
    // Behind the same flags as their routers, so the link never 404s too.
    defi: env.CLIENT_SIDE_DEFI_ENABLED
      ? { name: 'DeFi', href: '/defi/summary' }
      : undefined,
    tokens: env.CLIENT_SIDE_TOKENS_PAGE
      ? { name: 'Tokens', href: '/tokens' }
      : undefined,
  }
}

function getPathSegments(url: string): string[] {
  const { pathname } = new URL(url, 'http://localhost')
  return pathname.split('/').filter((segment) => segment !== '')
}

function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}
