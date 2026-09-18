import { ProjectService } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { execFileSync } from 'child_process'
import { createHash } from 'crypto'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'fs'
import os from 'os'
import path from 'path'
import type { ZkSourceEntry } from '../deployed/zk.js'

export interface FetchZkOptions {
  projectId: string
  /** `packages/config/src/projects`, used to locate the config database. */
  projectsDir: string
  zkCacheDir: string
  log: (message: string) => void
  /** Re-download sources even when the config-derived shared cache is populated. */
  refresh?: boolean
}

export interface ZkProject {
  contracts?: {
    programHashes?: { title: string; programUrl?: string }[]
  }
}

export interface ZkSourceRequest {
  type: ZkSourceEntry['type']
  name: string
  link: string
  address?: string
}

interface SharedSourceMetadata {
  link: string
  commit: string
  cachePath: string
  repository: string
  repoPath: string
}

export interface GitHubTree {
  repository: string
  url: string
  revision: string
  repoPath: string
  kind: 'tree' | 'blob'
  /** Everything after `/tree/` or `/blob/`; refs can themselves contain `/`. */
  tail: string
}

/**
 * Fetches the sources of a project's zk programs into
 * `.cache/zk/<project>/` with a `zk-sources.json`, replacing the dataset's old
 * `deployed-contracts/_zk` convention.
 *
 * Program sources come from `contracts.programHashes[].programUrl`.
 * Verifier source diffs are intentionally disabled for the prototype because
 * repository-level source links produce noisy and misleading comparisons.
 */
export class ZkSourceSync {
  private readonly ps: ProjectService
  private readonly materialized = new Map<string, SharedSourceMetadata>()

  constructor(private readonly options: Omit<FetchZkOptions, 'projectId'>) {
    const dbPath = configDatabasePath(options.projectsDir)
    if (!existsSync(dbPath)) {
      throw new Error(
        `config database not found at ${dbPath}; run \`pnpm --filter @l2beat/config build\` first`,
      )
    }
    this.ps = new ProjectService(dbPath)
  }

  async sync(projectId: string, refresh = false): Promise<void> {
    const { log, zkCacheDir } = this.options
    const projectDir = path.join(zkCacheDir, projectId)
    mkdirSync(projectDir, { recursive: true })
    const project = await this.ps.getProject({
      id: ProjectId(projectId),
      optional: ['contracts'],
    })
    if (!project) {
      writeSourceManifest(projectDir, [])
      log(`${projectId}: no project config, 0 zk source(s) loaded`)
      return
    }

    const wanted = getZkSourceRequests(project)
    const entries: ZkSourceEntry[] = []
    for (const item of wanted) {
      const tree = parseGitHubUrl(item.link)
      if (!tree) {
        log(`${projectId}: cannot parse GitHub link ${item.link}, skipped`)
        continue
      }
      let source: SharedSourceMetadata
      try {
        source = this.materialize(tree, item.link, refresh)
      } catch (error) {
        log(
          `${projectId}: cannot fetch ${item.link}, skipped: ${firstLine(error)}`,
        )
        continue
      }
      entries.push({
        type: item.type,
        name: item.name,
        link: item.link,
        commit: source.commit,
        address: item.address,
        path: logicalPath(item),
        cachePath: source.cachePath,
        repository: source.repository,
        repoPath: source.repoPath,
      })
    }
    writeSourceManifest(projectDir, entries)
    log(`${projectId}: ${entries.length} zk source(s) loaded from config`)
  }

  private materialize(
    tree: GitHubTree,
    link: string,
    refresh: boolean,
  ): SharedSourceMetadata {
    const alreadyMaterialized = this.materialized.get(link)
    if (alreadyMaterialized) return alreadyMaterialized

    const key = createHash('sha256').update(link).digest('hex')
    const cachePath = path.posix.join('sources', key)
    const target = path.join(this.options.zkCacheDir, cachePath)
    const metadataFile = path.join(
      this.options.zkCacheDir,
      'source-metadata',
      `${key}.json`,
    )
    const cached = readSharedSourceMetadata(metadataFile)
    if (!refresh && cached?.link === link && existsSync(target)) {
      this.materialized.set(link, cached)
      return cached
    }

    this.options.log(`fetching ${link}`)
    const temporaryTarget = path.join(
      this.options.zkCacheDir,
      'tmp',
      `${key}-${process.pid}`,
    )
    rmSync(temporaryTarget, { recursive: true, force: true })
    mkdirSync(path.dirname(temporaryTarget), { recursive: true })
    const fetched = fetchTree(tree, temporaryTarget)
    rmSync(target, { recursive: true, force: true })
    mkdirSync(path.dirname(target), { recursive: true })
    renameSync(temporaryTarget, target)
    const metadata = {
      link,
      commit: fetched.commit,
      cachePath,
      repository: fetched.tree.repository,
      repoPath: fetched.tree.repoPath,
    }
    mkdirSync(path.dirname(metadataFile), { recursive: true })
    writeFileSync(metadataFile, JSON.stringify(metadata, null, 2))
    this.materialized.set(link, metadata)
    return metadata
  }
}

function writeSourceManifest(
  projectDir: string,
  entries: ZkSourceEntry[],
): void {
  writeFileSync(
    path.join(projectDir, 'zk-sources.json'),
    JSON.stringify(entries, null, 2),
  )
}

export async function fetchZkSources(options: FetchZkOptions): Promise<void> {
  const sync = new ZkSourceSync(options)
  await sync.sync(options.projectId, options.refresh ?? true)
}

function configDatabasePath(projectsDir: string): string {
  const dbPath = path.resolve(projectsDir, '..', '..', 'build', 'db.sqlite')
  return dbPath
}

export function getZkSourceRequests(project: ZkProject): ZkSourceRequest[] {
  const wanted: ZkSourceRequest[] = []
  // TODO: Reintroduce verifier source fetching once the prototype has a
  // verifier-specific source selection and comparison strategy.
  for (const program of project.contracts?.programHashes ?? []) {
    if (program.programUrl) {
      wanted.push({
        type: 'program',
        name: program.title,
        link: program.programUrl,
      })
    }
  }
  return wanted
}

/** `https://github.com/<owner>/<repo>/(tree|blob)/<revision>/<path>` */
export function parseGitHubUrl(url: string): GitHubTree | undefined {
  const cleanUrl = url.split(/[?#]/, 1)[0]
  if (!cleanUrl) return undefined
  const m =
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/(tree|blob)\/(.+)$/.exec(
      cleanUrl.trim(),
    )
  if (!m) return undefined
  const [, owner, repo, kind, tail] = m
  if (!owner || !repo || !tail) return undefined
  const [revision = '', ...rest] = tail.split('/')
  if (!revision) return undefined
  return {
    repository: `${owner}/${repo.replace(/\.git$/, '')}`,
    url: `https://github.com/${owner}/${repo.replace(/\.git$/, '')}`,
    revision: decodeURIComponent(revision),
    repoPath: rest.join('/').replace(/\/$/, ''),
    kind: kind as 'tree' | 'blob',
    tail: tail.replace(/\/$/, ''),
  }
}

/** Fetches one revision shallowly and extracts `repoPath`; returns the commit. */
function fetchTree(
  tree: GitHubTree,
  target: string,
): { commit: string; tree: GitHubTree } {
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'audit-diff-zk-'))
  try {
    const git = (...args: string[]) =>
      execFileSync('git', ['-C', tmp, ...args], {
        stdio: ['ignore', 'pipe', 'pipe'],
      })
    git('init', '-q')
    git('remote', 'add', 'origin', tree.url)
    const resolved = resolveRef(tree, git)
    git('fetch', '-q', '--depth', '1', 'origin', resolved.revision)
    const commit = git('rev-parse', 'FETCH_HEAD').toString().trim()
    mkdirSync(target, { recursive: true })
    const archive = execFileSync(
      'git',
      [
        '-C',
        tmp,
        'archive',
        '--format=tar',
        'FETCH_HEAD',
        ...(resolved.repoPath ? [resolved.repoPath] : []),
      ],
      { maxBuffer: 1024 * 1024 * 512 },
    )
    // Strip the repoPath prefix so the target holds the tree's contents.
    const depth = resolved.repoPath ? resolved.repoPath.split('/').length : 0
    execFileSync(
      'tar',
      [
        '-x',
        '-C',
        target,
        ...(depth > 0
          ? [
              `--strip-components=${resolved.kind === 'blob' ? depth - 1 : depth}`,
            ]
          : []),
      ],
      { input: archive },
    )
    return { commit, tree: resolved }
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

function resolveRef(
  tree: GitHubTree,
  git: (...args: string[]) => Buffer,
): GitHubTree {
  // A commit hash cannot contain `/`, so its boundary is unambiguous.
  if (/^[0-9a-f]{40}$/i.test(tree.revision)) return tree

  const refs = git('ls-remote', '--heads', '--tags', 'origin')
    .toString()
    .split('\n')
    .flatMap((line) => {
      const name = line.split(/\s+/, 2)[1]
      if (!name) return []
      return [
        name.replace(/^refs\/(?:heads|tags)\//, '').replace(/\^\{\}$/, ''),
      ]
    })
  return resolveRefFromNames(tree, refs)
}

export function resolveRefFromNames(
  tree: GitHubTree,
  refs: string[],
): GitHubTree {
  const ref = refs
    .filter((name) => tree.tail === name || tree.tail.startsWith(`${name}/`))
    .sort((a, b) => b.length - a.length)[0]
  if (!ref) return tree
  return {
    ...tree,
    revision: ref,
    repoPath: tree.tail.slice(ref.length).replace(/^\//, ''),
  }
}

function safeDirName(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^_+|_+$/g, '')
}

function logicalPath(item: ZkSourceRequest): string {
  const suffix = createHash('sha256')
    .update(item.link)
    .digest('hex')
    .slice(0, 8)
  return `${safeDirName(`${item.type}-${item.name}`)}-${suffix}`
}

function readSharedSourceMetadata(
  file: string,
): SharedSourceMetadata | undefined {
  if (!existsSync(file)) return undefined
  try {
    return JSON.parse(readFileSync(file, 'utf8')) as SharedSourceMetadata
  } catch {
    return undefined
  }
}

function firstLine(error: unknown): string {
  return String(error).split('\n', 1)[0] ?? String(error)
}
