import { assert, type json } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { WatchTemplate } from '../WatchTemplate'
import { sortDeep } from '../watchedValue'
import { fetchGithubTree } from './github'

const Params = v.strictObject({
  repository: v.string().check(isRepository, 'Expected owner/repo'),
  branch: v
    .string()
    .check(isBranch, 'Expected non-empty branch without whitespace'),
  path: v.string().check(isDirectoryPath, 'Invalid directory path'),
  extensions: v
    .array(v.string().check(isExtension, 'Expected extension starting with .'))
    .optional(),
})

// Tracks files under a GitHub directory (e.g. security audits) by blob sha and
// byte size, so additions, removals and edits surface in watch diffs.
export const githubDirectory: WatchTemplate<typeof Params> = {
  name: 'githubDirectory',
  params: Params,
  async fetch(params, context) {
    const tree = await fetchGithubTree(
      context,
      params.repository,
      params.branch,
    )
    const prefix = normalizePrefix(params.path)
    const extensions = params.extensions?.map((ext) => ext.toLowerCase())
    const files: Record<string, { sha: string; size: number }> = {}

    for (const entry of tree.tree) {
      if (entry.type !== 'blob') {
        continue
      }
      if (prefix !== '' && !entry.path.startsWith(prefix)) {
        continue
      }
      if (
        extensions !== undefined &&
        !matchesExtension(entry.path, extensions)
      ) {
        continue
      }
      assert(entry.size !== undefined, 'GitHub blob missing size', {
        repository: params.repository,
        path: entry.path,
      })
      files[`${params.repository}:${entry.path}`] = {
        sha: entry.sha,
        size: entry.size,
      }
    }

    return sortDeep(files as json)
  },
}

function normalizePrefix(raw: string): string {
  let start = 0
  while (start < raw.length && raw[start] === '/') {
    start++
  }
  let end = raw.length
  while (end > start && raw[end - 1] === '/') {
    end--
  }
  const trimmed = raw.slice(start, end)
  return trimmed === '' ? '' : `${trimmed}/`
}

function matchesExtension(filePath: string, extensions: string[]): boolean {
  const lower = filePath.toLowerCase()
  return extensions.some((ext) => lower.endsWith(ext))
}

function isRepository(value: string): boolean {
  const parts = value.split('/')
  if (parts.length !== 2) {
    return false
  }
  return parts.every(
    (part) =>
      part.length > 0 &&
      part !== '.' &&
      part !== '..' &&
      !hasControlOrQueryChar(part),
  )
}

function isBranch(value: string): boolean {
  return value.length > 0 && !hasControlOrQueryChar(value)
}

function isDirectoryPath(value: string): boolean {
  return !value.split('/').some((segment) => segment === '..')
}

function isExtension(value: string): boolean {
  return value.length > 1 && value.startsWith('.') && !value.includes('/')
}

function hasControlOrQueryChar(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i)
    if (code <= 32 || code === 127) {
      return true
    }
    const ch = value[i]
    if (ch === '?' || ch === '#') {
      return true
    }
  }
  return false
}
