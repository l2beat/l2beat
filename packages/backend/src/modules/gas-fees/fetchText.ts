import { fetchWithTimeout } from '@l2beat/shared'

export type FetchText = (
  url: string,
) => Promise<{ status: number; text: string }>

/** These are a few kilobytes: longer than this in all, and the server is feeding them slowly */
const DEADLINE_MS = 30_000

/** A GET's status and body, whatever the status, for callers that branch on it */
export const fetchText: FetchText = async (url) => {
  // The helper's own timeout restarts with every chunk, so a slow drip never ends
  const response = await fetchWithTimeout(url, {
    signal: AbortSignal.timeout(DEADLINE_MS),
  })
  return { status: response.status, text: await response.text() }
}
