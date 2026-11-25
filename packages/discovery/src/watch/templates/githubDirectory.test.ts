import type { HttpClient } from '@l2beat/shared'
import type { json } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { sortDeep } from '../watchedValue'
import { githubDirectory } from './githubDirectory'

const TREE_RESPONSE: json = {
  truncated: false,
  tree: [
    { path: 'docs/security-reviews', type: 'tree', sha: 'tree-sha' },
    {
      path: 'docs/security-reviews/2026-audit-b.PDF',
      type: 'blob',
      sha: 'bbb222',
      size: 2048,
    },
    {
      path: 'docs/security-reviews/2026-audit-a.pdf',
      type: 'blob',
      sha: 'aaa111',
      size: 1024,
    },
    {
      path: 'docs/security-reviews/notes.md',
      type: 'blob',
      sha: 'ccc333',
      size: 512,
    },
    {
      path: 'docs/security-reviews/ignore.txt',
      type: 'blob',
      sha: 'ddd444',
      size: 100,
    },
    {
      path: 'docs/security-reviews-old/legacy.pdf',
      type: 'blob',
      sha: 'eee555',
      size: 999,
    },
  ],
}

describe(githubDirectory.name, () => {
  it('returns sorted blobs under path matching extensions, respecting directory boundaries', async () => {
    const fetch = mockFn().resolvesTo(TREE_RESPONSE)
    const context = {
      http: mockObject<HttpClient>({ fetch }),
      githubToken: 'secret-token',
    }

    const result = await githubDirectory.fetch(
      {
        repository: 'ethereum-optimism/optimism',
        branch: 'develop',
        path: 'docs/security-reviews',
        extensions: ['.pdf', '.md'],
      },
      context,
    )

    expect(result).toEqual({
      'ethereum-optimism/optimism:docs/security-reviews/2026-audit-a.pdf': {
        sha: 'aaa111',
        size: 1024,
      },
      'ethereum-optimism/optimism:docs/security-reviews/2026-audit-b.PDF': {
        sha: 'bbb222',
        size: 2048,
      },
      'ethereum-optimism/optimism:docs/security-reviews/notes.md': {
        sha: 'ccc333',
        size: 512,
      },
    })
    expect(fetch).toHaveBeenOnlyCalledWith(
      'https://api.github.com/repos/ethereum-optimism/optimism/git/trees/develop?recursive=1',
      {
        headers: {
          accept: 'application/vnd.github+json',
          'x-github-api-version': '2022-11-28',
          authorization: 'Bearer secret-token',
        },
        timeout: 30_000,
      },
    )
  })

  it('is deterministic across repeated runs and sorted', async () => {
    const context = {
      http: mockObject<HttpClient>({
        fetch: mockFn().resolvesTo(TREE_RESPONSE),
      }),
    }
    const params = {
      repository: 'org/repo',
      branch: 'main',
      path: '/docs/security-reviews/',
    }
    const first = await githubDirectory.fetch(params, context)
    const second = await githubDirectory.fetch(params, context)
    expect(JSON.stringify(first)).toEqual(JSON.stringify(second))
    expect(JSON.stringify(first)).toEqual(JSON.stringify(sortDeep(first)))
  })

  it('forwards context.signal to the HTTP client', async () => {
    const controller = new AbortController()
    const fetch = mockFn().resolvesTo(TREE_RESPONSE)
    await githubDirectory.fetch(
      { repository: 'org/repo', branch: 'main', path: 'docs/security-reviews' },
      { http: mockObject<HttpClient>({ fetch }), signal: controller.signal },
    )
    expect(fetch).toHaveBeenOnlyCalledWith(
      'https://api.github.com/repos/org/repo/git/trees/main?recursive=1',
      {
        headers: {
          accept: 'application/vnd.github+json',
          'x-github-api-version': '2022-11-28',
        },
        timeout: 30_000,
        signal: controller.signal,
      },
    )
  })

  it('throws when GitHub reports a truncated tree', async () => {
    const context = {
      http: mockObject<HttpClient>({
        fetch: mockFn().resolvesTo({ truncated: true, tree: [] }),
      }),
    }
    await expect(
      githubDirectory.fetch(
        { repository: 'org/repo', branch: 'main', path: 'audits' },
        context,
      ),
    ).toBeRejectedWith('GitHub tree truncated')
  })

  it('throws when a matching blob has no size', async () => {
    const context = {
      http: mockObject<HttpClient>({
        fetch: mockFn().resolvesTo({
          truncated: false,
          tree: [{ path: 'audits/a.pdf', type: 'blob', sha: 'aaa' }],
        }),
      }),
    }
    await expect(
      githubDirectory.fetch(
        { repository: 'org/repo', branch: 'main', path: 'audits' },
        context,
      ),
    ).toBeRejectedWith('GitHub blob missing size')
  })

  it('validates repository, branch, path, and extensions params', () => {
    expect(
      githubDirectory.params.safeValidate({
        repository: 'not-a-repo',
        branch: 'main',
        path: 'audits',
      }).success,
    ).toEqual(false)
    expect(
      githubDirectory.params.safeValidate({
        repository: 'org/repo',
        branch: 'main?foo=1',
        path: 'audits',
      }).success,
    ).toEqual(false)
    expect(
      githubDirectory.params.safeValidate({
        repository: 'org/repo',
        branch: 'main',
        path: '../escape',
      }).success,
    ).toEqual(false)
    expect(
      githubDirectory.params.safeValidate({
        repository: 'org/repo',
        branch: 'main',
        path: 'audits',
        extensions: ['pdf'],
      }).success,
    ).toEqual(false)
  })

  it('rejects private repositories when running with publicOnly and a token', async () => {
    const fetchPrivate = mockFn().resolvesTo({ private: true })
    await expect(
      githubDirectory.fetch(
        { repository: 'org/secret', branch: 'main', path: 'audits' },
        {
          http: mockObject<HttpClient>({ fetch: fetchPrivate }),
          githubToken: 'public-token',
          publicOnly: true,
        },
      ),
    ).toBeRejectedWith('GitHub repository is private')
    expect(fetchPrivate).toHaveBeenCalledTimes(1)

    const fetchPublic = mockFn()
      .resolvesToOnce({ private: false })
      .resolvesToOnce(TREE_RESPONSE)
    const result = await githubDirectory.fetch(
      {
        repository: 'org/public',
        branch: 'main',
        path: 'docs/security-reviews',
        extensions: ['.pdf'],
      },
      {
        http: mockObject<HttpClient>({ fetch: fetchPublic }),
        githubToken: 'public-token',
        publicOnly: true,
      },
    )
    expect(Object.keys(result as Record<string, unknown>).length).toEqual(2)
  })
})
