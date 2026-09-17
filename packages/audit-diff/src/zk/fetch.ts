import { ProjectService } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { execFileSync } from 'child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs'
import os from 'os'
import path from 'path'
import type { ZkSourceEntry } from '../deployed/zk.js'

export interface FetchZkOptions {
  projectId: string
  /** `packages/config/src/projects`, used to locate the config database. */
  projectsDir: string
  zkCacheDir: string
  log: (message: string) => void
}

interface GitHubTree {
  repository: string
  url: string
  revision: string
  repoPath: string
}

/**
 * Fetches the sources of a project's zk verifiers and programs into
 * `.cache/zk/<project>/` with a `zk-sources.json`, replacing the dataset's old
 * `deployed-contracts/_zk` convention.
 *
 * Verifier sources come from `zkCatalogInfo.verifierHashes[].sourceLink` of
 * the zk catalog project whose `knownDeployments` contain one of the
 * project's `contracts.zkVerifiers` addresses. Program sources come from
 * `contracts.programHashes[].programUrl`.
 */
export async function fetchZkSources(options: FetchZkOptions): Promise<void> {
  const { log } = options
  const dbPath = path.resolve(
    options.projectsDir,
    '..',
    '..',
    'build',
    'db.sqlite',
  )
  if (!existsSync(dbPath)) {
    throw new Error(
      `config database not found at ${dbPath}; run \`pnpm --filter @l2beat/config build\` first`,
    )
  }
  const ps = new ProjectService(dbPath)
  const project = await ps.getProject({
    id: ProjectId(options.projectId),
    optional: ['contracts'],
  })
  if (!project) throw new Error(`unknown project ${options.projectId}`)

  const wanted: {
    type: ZkSourceEntry['type']
    name: string
    link: string
    address?: string
  }[] = []

  const verifierAddresses = new Set(
    (project.contracts?.zkVerifiers ?? []).map((a) => a.toString()),
  )
  if (verifierAddresses.size > 0) {
    const catalog = await ps.getProjects({ select: ['zkCatalogInfo'] })
    for (const entry of catalog) {
      for (const verifier of entry.zkCatalogInfo.verifierHashes) {
        const deployment = verifier.knownDeployments.find((d) =>
          verifierAddresses.has(d.address.toString()),
        )
        if (!deployment || !verifier.sourceLink) continue
        wanted.push({
          type: 'verifier',
          name: verifier.name,
          link: verifier.sourceLink,
          address: deployment.address.toString(),
        })
      }
    }
  }
  for (const program of project.contracts?.programHashes ?? []) {
    if (program.programUrl) {
      wanted.push({
        type: 'program',
        name: program.title,
        link: program.programUrl,
      })
    }
  }

  const projectDir = path.join(options.zkCacheDir, options.projectId)
  rmSync(projectDir, { recursive: true, force: true })
  mkdirSync(projectDir, { recursive: true })
  const entries: ZkSourceEntry[] = []
  for (const item of wanted) {
    const tree = parseGitHubUrl(item.link)
    if (!tree) {
      log(
        `${options.projectId}: cannot parse GitHub link ${item.link}, skipped`,
      )
      continue
    }
    const dirName = safeDirName(`${item.type}-${item.name}`)
    const target = path.join(projectDir, dirName)
    log(
      `${options.projectId}: fetching ${item.type} ${item.name} from ${item.link}`,
    )
    const commit = fetchTree(tree, target)
    entries.push({
      type: item.type,
      name: item.name,
      link: item.link,
      commit,
      address: item.address,
      path: dirName,
      repository: tree.repository,
      repoPath: tree.repoPath,
    })
  }
  writeFileSync(
    path.join(projectDir, 'zk-sources.json'),
    JSON.stringify(entries, null, 2),
  )
  log(
    `${options.projectId}: ${entries.length} zk source(s) written to ${projectDir}`,
  )
}

/** `https://github.com/<owner>/<repo>/(tree|blob)/<revision>/<path>` */
export function parseGitHubUrl(url: string): GitHubTree | undefined {
  const m =
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/(?:tree|blob)\/([^/]+)(?:\/(.*))?$/.exec(
      url.trim(),
    )
  if (!m) return undefined
  const [, owner, repo, revision, rest] = m
  if (!owner || !repo || !revision) return undefined
  return {
    repository: `${owner}/${repo.replace(/\.git$/, '')}`,
    url: `https://github.com/${owner}/${repo.replace(/\.git$/, '')}`,
    revision: decodeURIComponent(revision),
    repoPath: (rest ?? '').replace(/\/$/, ''),
  }
}

/** Fetches one revision shallowly and extracts `repoPath`; returns the commit. */
function fetchTree(tree: GitHubTree, target: string): string {
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'audit-diff-zk-'))
  try {
    const git = (...args: string[]) =>
      execFileSync('git', ['-C', tmp, ...args], {
        stdio: ['ignore', 'pipe', 'pipe'],
      })
    git('init', '-q')
    git('remote', 'add', 'origin', tree.url)
    git('fetch', '-q', '--depth', '1', 'origin', tree.revision)
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
        ...(tree.repoPath ? [tree.repoPath] : []),
      ],
      { maxBuffer: 1024 * 1024 * 512 },
    )
    // Strip the repoPath prefix so the target holds the tree's contents.
    const depth = tree.repoPath ? tree.repoPath.split('/').length : 0
    const isFile = tree.repoPath !== '' && !tree.repoPath.endsWith('/')
    execFileSync(
      'tar',
      [
        '-x',
        '-C',
        target,
        ...(depth > 0
          ? [`--strip-components=${isFile ? depth - 1 : depth}`]
          : []),
      ],
      { input: archive },
    )
    return commit
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

function safeDirName(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^_+|_+$/g, '')
}
