import type { GitRepos, TreeEntry } from './GitRepos'

/** Where a file of the snapshot comes from. */
export interface FileOrigin {
  /** Canonical repository id, `owner/repo` on GitHub. */
  repository: string
  commit: string
  /** Path inside that repository. */
  path: string
  /** Git blob id of the file there. */
  blob: string
  /** Where the repository sits in the snapshot; '' for the audited one. */
  mount: string
}

interface Mount {
  prefix: string
  url: string
  repository: string
  commit: string
  files: Map<string, TreeEntry>
  /** Submodule path to its pinned commit. */
  gitlinks: Map<string, string>
  /** Submodule path to its URL, from `.gitmodules`. */
  submoduleUrls: Map<string, string>
  contents: Map<string, string>
}

const CONFIG_NAMES = [
  'foundry.toml',
  'remappings.txt',
  'package.json',
  '.gitmodules',
]

/**
 * A repository at a commit as a file tree, with every submodule at the commit
 * the tree pins, read on first access. Only Solidity and the files that
 * decide import resolution are loaded.
 */
export class RepoSnapshot {
  private readonly mounts = new Map<string, Mount | undefined>()
  /** Submodules that could not be read: mount path to the reason. */
  readonly unreadable = new Map<string, string>()

  constructor(
    private readonly repos: GitRepos,
    readonly url: string,
    readonly commit: string,
  ) {
    this.mounts.set('', this.load('', url, commit))
  }

  /** Paths of the audited repository itself, submodules not included. */
  ownFiles(): string[] {
    return [...this.root().files.keys()]
  }

  has(path: string): boolean {
    return this.locate(path) !== undefined
  }

  read(path: string): string | undefined {
    const located = this.locate(path)
    if (located === undefined) return undefined
    const { mount, entry } = located
    let content = mount.contents.get(entry.oid)
    if (content === undefined) {
      content = this.repos.read(mount.url, [entry.oid]).get(entry.oid)
      if (content !== undefined) mount.contents.set(entry.oid, content)
    }
    return content
  }

  origin(path: string): FileOrigin | undefined {
    const located = this.locate(path)
    if (located === undefined) return undefined
    const { mount, entry } = located
    return {
      repository: mount.repository,
      commit: mount.commit,
      path: entry.path,
      blob: entry.oid,
      mount: mount.prefix,
    }
  }

  /** The submodule the path lies in, '' for the audited repository. */
  mountOf(path: string): string {
    return this.resolveMount(path)?.mount.prefix ?? ''
  }

  /** Files named like `name` in the mount the directory belongs to. */
  configsNamed(name: string, mountPrefix: string): string[] {
    const mount = this.mounts.get(mountPrefix)
    if (mount === undefined) return []
    return [...mount.files.keys()]
      .filter((p) => p === name || p.endsWith(`/${name}`))
      .map((p) => join(mount.prefix, p))
  }

  tagAt(mountPrefix: string): string | undefined {
    const mount = this.mounts.get(mountPrefix)
    if (mount === undefined) return undefined
    return this.repos.tagAt(mount.url, mount.commit)
  }

  timestamp(mountPrefix: string): number | undefined {
    const mount = this.mounts.get(mountPrefix)
    if (mount === undefined) return undefined
    return this.repos.timestamp(mount.url, mount.commit)
  }

  private root(): Mount {
    return this.mounts.get('') as Mount
  }

  private locate(path: string): { mount: Mount; entry: TreeEntry } | undefined {
    const resolved = this.resolveMount(path)
    if (resolved === undefined) return undefined
    const entry = resolved.mount.files.get(resolved.relative)
    return entry === undefined ? undefined : { mount: resolved.mount, entry }
  }

  private resolveMount(
    path: string,
  ): { mount: Mount; relative: string } | undefined {
    let mount = this.root()
    let relative = path
    for (;;) {
      const gitlink = gitlinkAbove(mount, relative)
      if (gitlink === undefined) return { mount, relative }
      const prefix = join(mount.prefix, gitlink)
      const next = this.submodule(mount, gitlink, prefix)
      if (next === undefined) return undefined
      relative = relative.slice(gitlink.length + 1)
      mount = next
    }
  }

  private submodule(
    parent: Mount,
    gitlink: string,
    prefix: string,
  ): Mount | undefined {
    if (this.mounts.has(prefix)) return this.mounts.get(prefix)
    const commit = parent.gitlinks.get(gitlink) as string
    const url = parent.submoduleUrls.get(gitlink)
    let mount: Mount | undefined
    if (url === undefined) {
      this.unreadable.set(prefix, 'no URL in .gitmodules')
    } else {
      try {
        mount = this.load(prefix, url, commit)
      } catch (error) {
        this.unreadable.set(prefix, `${url}@${commit}: ${firstLine(error)}`)
      }
    }
    this.mounts.set(prefix, mount)
    return mount
  }

  private load(prefix: string, url: string, commit: string): Mount {
    const entries = this.repos.tree(url, commit)
    const files = new Map<string, TreeEntry>()
    const gitlinks = new Map<string, string>()
    for (const entry of entries) {
      if (entry.mode === '160000') {
        gitlinks.set(entry.path, entry.oid)
      } else {
        files.set(entry.path, entry)
      }
    }
    const wanted = [...files.values()].filter(
      (entry) =>
        entry.path.endsWith('.sol') ||
        CONFIG_NAMES.includes(entry.path.split('/').at(-1) as string),
    )
    const byOid = this.repos.read(
      url,
      wanted.map((entry) => entry.oid),
    )
    const gitmodules = files.get('.gitmodules')
    const submoduleUrls =
      gitmodules === undefined
        ? new Map<string, string>()
        : parseGitmodules(byOid.get(gitmodules.oid) ?? '', url)
    return {
      prefix,
      url,
      repository: repositoryId(url),
      commit,
      files,
      gitlinks,
      submoduleUrls,
      contents: byOid,
    }
  }
}

function gitlinkAbove(mount: Mount, path: string): string | undefined {
  if (mount.gitlinks.size === 0) return undefined
  const parts = path.split('/')
  for (let end = 1; end < parts.length; end++) {
    const prefix = parts.slice(0, end).join('/')
    if (mount.gitlinks.has(prefix)) return prefix
  }
  return undefined
}

function parseGitmodules(content: string, parentUrl: string) {
  const urls = new Map<string, string>()
  let path: string | undefined
  let url: string | undefined
  const flush = () => {
    if (path !== undefined && url !== undefined) {
      urls.set(path, normalizeUrl(url, parentUrl))
    }
    path = undefined
    url = undefined
  }
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith('[')) {
      flush()
      continue
    }
    const match = /^(path|url)\s*=\s*(.+)$/.exec(trimmed)
    if (match?.[1] === 'path') path = match[2]?.trim()
    if (match?.[1] === 'url') url = match[2]?.trim()
  }
  flush()
  return urls
}

function normalizeUrl(url: string, parentUrl: string): string {
  let result = url
  if (result.startsWith('../') || result.startsWith('./')) {
    result = new URL(result, `${parentUrl}/`).toString()
  }
  const ssh = /^git@([^:]+):(.+)$/.exec(result)
  if (ssh) result = `https://${ssh[1]}/${ssh[2]}`
  result = result.replace(/^git:\/\//, 'https://')
  return result.replace(/\.git$/, '').replace(/\/$/, '')
}

export function repositoryId(url: string): string {
  const stripped = url.replace(/^https?:\/\//, '').replace(/\.git$/, '')
  return stripped.startsWith('github.com/')
    ? stripped.slice('github.com/'.length)
    : stripped
}

export function join(prefix: string, path: string): string {
  return prefix === '' ? path : `${prefix}/${path}`
}

function firstLine(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  return message.split('\n').find((line) => line.trim().length > 0) ?? ''
}
