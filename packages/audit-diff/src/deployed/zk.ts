import { closeSync, existsSync, openSync, readSync } from 'fs'
import path from 'path'
import { readJson, walk } from './fs.js'

/** One entry of `.cache/zk/<project>/zk-sources.json`, written by `fetch-zk`. */
export interface ZkSourceEntry {
  type: 'verifier' | 'program'
  name: string
  link: string
  commit: string
  /** Chain-specific address, e.g. `eth:0x...`, verifiers only. */
  address?: string
  /** Directory inside the project's zk cache holding the fetched sources. */
  path: string
  /** Repository the sources were fetched from, canonical `owner/repo`. */
  repository: string
  /** Repository-relative path of the fetched tree or file. */
  repoPath: string
}

export interface ZkSourceFile {
  file: string
  /** Path relative to the zk cache root, used in the output. */
  relativePath: string
  /** Repository-relative path, used for path-suffix matching. */
  repoPath: string
}

export function zkProjectDir(zkCacheDir: string, projectId: string): string {
  return path.join(zkCacheDir, projectId)
}

export function readZkSources(
  zkCacheDir: string,
  projectId: string,
): ZkSourceEntry[] {
  const file = path.join(zkProjectDir(zkCacheDir, projectId), 'zk-sources.json')
  return existsSync(file) ? readJson<ZkSourceEntry[]>(file) : []
}

export function listZkSourceFiles(
  zkCacheDir: string,
  projectId: string,
  entry: ZkSourceEntry,
): ZkSourceFile[] {
  const root = path.join(zkProjectDir(zkCacheDir, projectId), entry.path)
  if (!existsSync(root)) return []
  return walk(root)
    .filter((f) => !f.endsWith('.json') && isTextFile(f))
    .map((file) => {
      const below = path.relative(root, file).split(path.sep).join('/')
      return {
        file,
        relativePath: path.relative(zkCacheDir, file).split(path.sep).join('/'),
        repoPath: entry.repoPath.endsWith(below)
          ? entry.repoPath
          : path.posix.join(entry.repoPath, below),
      }
    })
}

/** Binary artifacts (verification keys, ELF files) are not sources. */
export function isTextFile(file: string): boolean {
  const fd = openSync(file, 'r')
  try {
    const buffer = Buffer.alloc(8192)
    const read = readSync(fd, buffer, 0, buffer.length, 0)
    for (let i = 0; i < read; i++) {
      if (buffer[i] === 0) return false
    }
    return true
  } finally {
    closeSync(fd)
  }
}
