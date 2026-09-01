export interface DehydratedQuery {
  queryKey: unknown
  state: {
    status: string
    data: unknown
    error?: unknown
  }
}

export interface SsrData {
  page: string
  props: {
    queryState?: {
      queries?: DehydratedQuery[]
    }
  }
}

const MARKER = 'window.__SSR_DATA__='

/**
 * Extracts and parses the `window.__SSR_DATA__` payload that the server injects
 * into every page (see src/server/server.ts). The value is `JSON.stringify`d,
 * so we walk from the marker to the matching closing brace (respecting string
 * literals) and JSON.parse it.
 */
export function extractSsrData(html: string): SsrData {
  const start = html.indexOf(MARKER)
  if (start === -1) {
    throw new Error('window.__SSR_DATA__ not found in HTML')
  }

  let i = start + MARKER.length
  if (html[i] !== '{') {
    throw new Error('window.__SSR_DATA__ is not an object literal')
  }

  let depth = 0
  let inString = false
  let escaped = false
  const begin = i
  for (; i < html.length; i++) {
    const ch = html[i]
    if (inString) {
      if (escaped) escaped = false
      else if (ch === '\\') escaped = true
      else if (ch === '"') inString = false
      continue
    }
    if (ch === '"') inString = true
    else if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) {
        const json = html.slice(begin, i + 1)
        return JSON.parse(json) as SsrData
      }
    }
  }

  throw new Error('Could not find end of window.__SSR_DATA__ object')
}
