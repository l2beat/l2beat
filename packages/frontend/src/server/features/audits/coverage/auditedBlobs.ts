import { env } from '~/env'

// Audited files are blobs of the audit dataset repository. A blob never
// changes, so it is cached for the process lifetime. Unauthenticated, GitHub
// allows 60 requests per hour per IP; GITHUB_TOKEN lifts that.

const cache = new Map<string, Promise<string>>()
const REQUEST_TIMEOUT_MS = 30_000

export function fetchAuditedBlob(
  repository: string,
  blob: string,
): Promise<string> {
  const key = `${repository}/${blob}`
  let pending = cache.get(key)
  if (!pending) {
    pending = fetchBlob(repository, blob).catch((e: unknown) => {
      cache.delete(key)
      throw e
    })
    cache.set(key, pending)
  }
  return pending
}

async function fetchBlob(repository: string, blob: string): Promise<string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.raw+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`
  const response = await fetch(
    `https://api.github.com/repos/${repository}/git/blobs/${blob}`,
    { headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) },
  )
  if (!response.ok) {
    throw new Error(
      `Fetching blob ${blob} of ${repository} failed: HTTP ${response.status}`,
    )
  }
  return response.text()
}
