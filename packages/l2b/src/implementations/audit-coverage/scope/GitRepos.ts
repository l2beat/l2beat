import { assert } from '@l2beat/shared-pure'
import { execFileSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import { homedir } from 'os'
import path from 'path'

export interface TreeEntry {
  /** '160000' is a submodule: `oid` is the pinned commit. */
  mode: string
  oid: string
  path: string
}

const MAX_BUFFER = 1 << 30

/**
 * Blobless clones of audited repositories, kept between runs. A commit brings
 * its trees only; the blobs a caller needs are fetched in one request.
 */
export class GitRepos {
  private readonly trees = new Map<string, TreeEntry[]>()
  private readonly tags = new Map<string, Map<string, string>>()

  constructor(
    private readonly cacheDir = path.join(
      homedir(),
      '.cache',
      'l2b-audit-scope',
    ),
  ) {}

  /** Every blob and submodule of the commit, by path. */
  tree(url: string, commit: string): TreeEntry[] {
    const key = `${url}@${commit}`
    const known = this.trees.get(key)
    if (known !== undefined) return known
    const dir = this.repository(url)
    if (!this.has(dir, commit)) {
      git(dir, [
        'fetch',
        '--quiet',
        '--depth=1',
        '--filter=blob:none',
        '--no-tags',
        'origin',
        commit,
      ])
    }
    const output = git(dir, ['ls-tree', '-r', '-z', '--full-tree', commit])
    const entries = output
      .split('\0')
      .filter((line) => line.length > 0)
      .map((line): TreeEntry => {
        const tab = line.indexOf('\t')
        const [mode, , oid] = line.slice(0, tab).split(' ')
        assert(mode !== undefined && oid !== undefined, 'Malformed tree entry')
        return { mode, oid, path: line.slice(tab + 1) }
      })
    this.trees.set(key, entries)
    return entries
  }

  /** Contents of the blobs, fetching the missing ones together. */
  read(url: string, oids: string[]): Map<string, string> {
    const dir = this.repository(url)
    const unique = [...new Set(oids)]
    const missing = this.missing(dir, unique)
    if (missing.length > 0) {
      git(
        dir,
        [
          '-c',
          'fetch.negotiationAlgorithm=noop',
          'fetch',
          '--quiet',
          '--no-tags',
          '--no-write-fetch-head',
          '--recurse-submodules=no',
          '--filter=blob:none',
          '--stdin',
          'origin',
        ],
        `${missing.join('\n')}\n`,
      )
    }
    const contents = new Map<string, string>()
    if (unique.length === 0) return contents
    const output = execFileSync('git', ['-C', dir, 'cat-file', '--batch'], {
      input: `${unique.join('\n')}\n`,
      maxBuffer: MAX_BUFFER,
      env: { ...process.env, GIT_NO_LAZY_FETCH: '1' },
    })
    let offset = 0
    for (const oid of unique) {
      const end = output.indexOf(0x0a, offset)
      const header = output.subarray(offset, end).toString('utf8').split(' ')
      assert(header[0] === oid && header[1] === 'blob', `${oid} is not a blob`)
      const size = Number(header[2])
      contents.set(
        oid,
        output.subarray(end + 1, end + 1 + size).toString('utf8'),
      )
      offset = end + 1 + size + 1
    }
    return contents
  }

  /** Committer time in unix seconds. */
  timestamp(url: string, commit: string): number {
    this.tree(url, commit)
    const output = git(this.repository(url), [
      'show',
      '-s',
      '--format=%ct',
      commit,
    ])
    return Number(output.trim())
  }

  /** The release tag pointing at the commit, if any. */
  tagAt(url: string, commit: string): string | undefined {
    let tags = this.tags.get(url)
    if (tags === undefined) {
      tags = new Map()
      try {
        const output = git(this.repository(url), [
          'ls-remote',
          '--tags',
          'origin',
        ])
        for (const line of output.split('\n')) {
          const [oid, ref] = line.split('\t')
          if (oid === undefined || ref === undefined) continue
          const name = ref.replace('refs/tags/', '').replace('^{}', '')
          // A peeled entry (`^{}`) is the commit an annotated tag points at.
          if (ref.endsWith('^{}') || !tags.has(oid)) tags.set(oid, name)
        }
      } catch {
        // No tags is a missing label, not an error.
      }
      this.tags.set(url, tags)
    }
    return tags.get(commit)
  }

  private repository(url: string): string {
    const dir = path.join(
      this.cacheDir,
      url.replace(/^https?:\/\//, '').replace(/\.git$/, '') + '.git',
    )
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
      git(dir, ['init', '--quiet', '--bare'])
      git(dir, ['remote', 'add', 'origin', url])
      git(dir, ['config', 'remote.origin.promisor', 'true'])
      git(dir, ['config', 'remote.origin.partialclonefilter', 'blob:none'])
    }
    return dir
  }

  private missing(dir: string, oids: string[]): string[] {
    if (oids.length === 0) return []
    const output = execFileSync(
      'git',
      ['-C', dir, 'cat-file', '--batch-check'],
      {
        input: `${oids.join('\n')}\n`,
        maxBuffer: MAX_BUFFER,
        encoding: 'utf8',
        env: { ...process.env, GIT_NO_LAZY_FETCH: '1' },
      },
    )
    return output
      .split('\n')
      .filter((line) => line.endsWith(' missing'))
      .map((line) => line.split(' ')[0] as string)
  }

  private has(dir: string, oid: string): boolean {
    try {
      execFileSync('git', ['-C', dir, 'cat-file', '-e', oid], {
        stdio: 'ignore',
        env: { ...process.env, GIT_NO_LAZY_FETCH: '1' },
      })
      return true
    } catch {
      return false
    }
  }
}

function git(dir: string, args: string[], input?: string): string {
  return execFileSync('git', ['-C', dir, ...args], {
    input,
    maxBuffer: MAX_BUFFER,
    encoding: 'utf8',
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    stdio: ['pipe', 'pipe', 'pipe'],
  })
}
