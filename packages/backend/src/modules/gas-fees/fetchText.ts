import { fetchWithTimeout } from '@l2beat/shared'

export type FetchText = (
  url: string,
) => Promise<{ status: number; text: string }>

/** A GET's status and body, whatever the status, for callers that branch on it */
export const fetchText: FetchText = async (url) => {
  const response = await fetchWithTimeout(url, {})
  return { status: response.status, text: await response.text() }
}
