import type { json } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { WatchContext } from '../WatchTemplate'

const GITHUB_TIMEOUT_MS = 30_000

export const GithubTree = v.object({
  truncated: v.boolean(),
  tree: v.array(v.object({ path: v.string(), type: v.string() })),
})
export type GithubTree = v.infer<typeof GithubTree>

// Anonymous GitHub allows 60 requests an hour per IP; the token lifts that.
export async function fetchGithubJson(
  context: WatchContext,
  url: string,
): Promise<json> {
  const headers: Record<string, string> = {
    accept: 'application/vnd.github+json',
    'x-github-api-version': '2022-11-28',
  }
  if (context.githubToken !== undefined && context.githubToken !== '') {
    headers.authorization = `Bearer ${context.githubToken}`
  }
  return await context.http.fetch(url, { headers, timeout: GITHUB_TIMEOUT_MS })
}

// A truncated tree lists only part of the repository, and the missing part
// would read as removed files.
export async function fetchGithubTree(
  context: WatchContext,
  repository: string,
  branch: string,
): Promise<GithubTree> {
  const url = `https://api.github.com/repos/${repository}/git/trees/${branch}?recursive=1`
  const tree = GithubTree.validate(await fetchGithubJson(context, url))
  if (tree.truncated) {
    throw new Error('GitHub tree truncated', { cause: { repository, branch } })
  }
  return tree
}
