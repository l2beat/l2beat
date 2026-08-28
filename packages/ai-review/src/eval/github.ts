import { execSync } from 'node:child_process'
import type { RawReview, RawReviewComment } from './comments.js'

export interface RawPull {
  number: number
  title: string
  body: string | null
  html_url: string
  merged_at: string | null
  merge_commit_sha: string
  user: { login: string; type: string }
  head: { sha: string; ref: string }
  base: { sha: string }
}

export interface SearchResult {
  number: number
  closed_at: string
}

export class GithubClient {
  private readonly token: string

  constructor(
    readonly repo: string,
    token?: string,
  ) {
    this.token = token ?? ghAuthToken()
  }

  getPull(pr: number) {
    return this.get<RawPull>(`/repos/${this.repo}/pulls/${pr}`)
  }

  getChangedFiles(pr: number) {
    return this.paginate<{ filename: string }>(
      `/repos/${this.repo}/pulls/${pr}/files?per_page=100`,
    ).then((files) => files.map((f) => f.filename))
  }

  getReviewComments(pr: number) {
    return this.paginate<RawReviewComment>(
      `/repos/${this.repo}/pulls/${pr}/comments?per_page=100`,
    )
  }

  getReviews(pr: number) {
    return this.paginate<RawReview>(
      `/repos/${this.repo}/pulls/${pr}/reviews?per_page=100`,
    )
  }

  async getCommitDate(sha: string): Promise<string | undefined> {
    const commit = await this.get<{ commit: { committer: { date: string } } }>(
      `/repos/${this.repo}/commits/${sha}`,
    ).catch(() => undefined)
    return commit?.commit.committer.date
  }

  async searchMergedPullsReviewedBy(
    login: string,
    limit: number,
  ): Promise<SearchResult[]> {
    const q = encodeURIComponent(
      `repo:${this.repo} is:pr is:merged reviewed-by:${login}`,
    )
    const results: SearchResult[] = []
    for (let page = 1; results.length < limit; page++) {
      const res = await this.get<{ items: SearchResult[] }>(
        `/search/issues?q=${q}&sort=updated&order=desc&per_page=100&page=${page}`,
      )
      results.push(...res.items)
      if (res.items.length < 100) break
    }
    return results.slice(0, limit)
  }

  private async paginate<T>(path: string): Promise<T[]> {
    const items: T[] = []
    let url: string | undefined = path
    while (url) {
      const res = await this.fetch(url)
      items.push(...((await res.json()) as T[]))
      url = nextLink(res.headers.get('link'))
    }
    return items
  }

  private async get<T>(path: string): Promise<T> {
    const res = await this.fetch(path)
    return (await res.json()) as T
  }

  private async fetch(pathOrUrl: string): Promise<Response> {
    const url = pathOrUrl.startsWith('http')
      ? pathOrUrl
      : `https://api.github.com${pathOrUrl}`
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
    if (!res.ok) {
      throw new Error(`GitHub ${res.status} ${url}: ${await res.text()}`)
    }
    return res
  }
}

function nextLink(header: string | null): string | undefined {
  return header?.match(/<([^>]+)>;\s*rel="next"/)?.[1]
}

function ghAuthToken(): string {
  const env = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN
  if (env) return env
  return execSync('gh auth token', { encoding: 'utf8' }).trim()
}
