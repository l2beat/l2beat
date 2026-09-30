/**
 * Read from the live document rather than from the SSR data, so the dev tools
 * show what a crawler gets: the tags the server actually rendered.
 */
export function readOpenGraph(head: ParentNode): OpenGraphTags {
  const og = (property: string) =>
    getContent(head, `meta[property="og:${property}"]`)
  return {
    title: og('title'),
    description: og('description'),
    url: og('url'),
    siteName: og('site_name'),
    type: og('type'),
    image: og('image'),
    twitterCard: getContent(head, 'meta[name="twitter:card"]'),
  }
}

export function readJsonLd(head: ParentNode): JsonLdBlock[] {
  const scripts = head.querySelectorAll('script[type="application/ld+json"]')
  return [...scripts].map((script) => parseJsonLd(script.textContent ?? ''))
}

export interface OpenGraphTags {
  title: string | undefined
  description: string | undefined
  url: string | undefined
  siteName: string | undefined
  type: string | undefined
  image: string | undefined
  twitterCard: string | undefined
}

export type JsonLdBlock =
  | { isValid: true; type: string; data: unknown }
  | { isValid: false; raw: string }

function parseJsonLd(raw: string): JsonLdBlock {
  try {
    const data: unknown = JSON.parse(raw)
    return { isValid: true, type: getType(data), data }
  } catch {
    return { isValid: false, raw }
  }
}

function getType(data: unknown): string {
  if (typeof data !== 'object' || data === null || !('@type' in data)) {
    return 'Untyped'
  }
  return String(data['@type'])
}

function getContent(head: ParentNode, selector: string) {
  return head.querySelector(selector)?.getAttribute('content') ?? undefined
}
