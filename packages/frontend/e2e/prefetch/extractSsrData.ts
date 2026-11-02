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

/**
 * Extracts and parses the SSR data that the server writes into every page as
 * `<script type="application/json" id="ssr-data">` (see src/server/server.ts).
 * The server escapes every `<` in it, so the first `<` ends the payload.
 */
export function extractSsrData(html: string): SsrData {
  const match = html.match(
    /<script type="application\/json" id="ssr-data">([^<]*)<\/script>/,
  )
  if (!match?.[1]) {
    throw new Error('SSR data script not found in HTML')
  }
  return JSON.parse(match[1]) as SsrData
}
