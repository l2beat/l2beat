const REQUEST_TIMEOUT_MS = 60_000

/** `owner/repo` of a https://github.com/owner/repo URL. */
export function getGithubRepository(url: string): string {
  const parsed = URL.parse(url)
  const segments = parsed?.pathname.split('/').filter((s) => s.length > 0)
  if (parsed?.hostname !== 'github.com' || segments?.length !== 2) {
    throw new Error('Not a GitHub repository', { cause: { url } })
  }
  return segments.join('/')
}

export async function fetchGithub(
  url: string,
  headers: Record<string, string>,
): Promise<Response> {
  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  if (!response.ok) {
    throw new Error('GitHub request failed', {
      cause: { url, status: response.status },
    })
  }
  return response
}
