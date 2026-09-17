import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import path from 'path'
import type {
  AuditSummaryJson,
  ManifestJson,
  ManifestSource,
  RegistryJson,
} from './types.js'

const LIBS_DIR = '_libs'

/** One evidence collection: a project directory or `_libs/<vendor>`. */
export interface Collection {
  /** Directory name, e.g. `tornado-cash` or `openzeppelin`. */
  id: string
  /** Display name from the summary's `project` field. */
  name: string
  kind: 'project' | 'library'
  /** Absolute directory. */
  dir: string
  /** Directory relative to the dataset root, e.g. `_libs/openzeppelin`. */
  relativeDir: string
  summary: AuditSummaryJson
  manifest: ManifestJson
}

export interface Dataset {
  root: string
  collections: Collection[]
  registry: RegistryJson
}

export function readDataset(root: string): Dataset {
  const collections: Collection[] = []
  for (const name of readdirSync(root).sort()) {
    const dir = path.join(root, name)
    if (!statSync(dir).isDirectory() || name.startsWith('.')) continue
    if (name === LIBS_DIR) {
      for (const vendor of readdirSync(dir).sort()) {
        const vendorDir = path.join(dir, vendor)
        if (!statSync(vendorDir).isDirectory()) continue
        const collection = readCollection(
          vendorDir,
          `${LIBS_DIR}/${vendor}`,
          vendor,
          'library',
        )
        if (collection) collections.push(collection)
      }
      continue
    }
    const collection = readCollection(dir, name, name, 'project')
    if (collection) collections.push(collection)
  }
  return { root, collections, registry: readRegistry(root) }
}

function readCollection(
  dir: string,
  relativeDir: string,
  id: string,
  kind: Collection['kind'],
): Collection | undefined {
  const summaryPath = path.join(dir, 'audit-summary.json')
  if (!existsSync(summaryPath)) return undefined
  const summary = readJson<AuditSummaryJson>(summaryPath)
  const manifestPath = path.join(dir, 'audited-sources', 'manifest.json')
  const manifest = existsSync(manifestPath)
    ? readJson<ManifestJson>(manifestPath)
    : { sources: [] }
  return {
    id,
    name: summary.project || id,
    kind,
    dir,
    relativeDir,
    summary,
    manifest,
  }
}

export function readRegistry(root: string): RegistryJson {
  const file = path.join(root, 'repositories.json')
  return existsSync(file)
    ? readJson<RegistryJson>(file)
    : { schema_version: '1.0.0', repositories: {} }
}

/** Reads a file referenced from `manifest.sources[].files[].file`. */
export function readAuditedFile(collection: Collection, file: string): string {
  return readFileSync(
    path.join(collection.dir, 'audited-sources', file),
    'utf8',
  )
}

/**
 * Recovers the repository-relative path of a fetched file. Files are stored as
 * `<repository>/<source_path>/<commit>/<rest>`; for `file` entries `rest` is
 * the file name, for directories it is the path below the scoped directory.
 */
export function auditedFileRepoPath(
  source: ManifestSource,
  file: string,
): string {
  const prefix = `${source.repository}/${source.source_path}/${source.commit}/`
  const rest = file.startsWith(prefix) ? file.slice(prefix.length) : file
  return source.path_kind === 'file'
    ? source.source_path
    : path.posix.join(source.source_path, rest)
}

export function githubBlobUrl(source: ManifestSource, repoPath: string) {
  const base = source.repository_url.replace(/\.git$/, '').replace(/\/$/, '')
  return `${base}/blob/${source.commit}/${repoPath}`
}

/** Repositories referenced by a collection's relevant reports. */
export function referencedRepositories(collection: Collection): string[] {
  const repos = new Set<string>()
  for (const report of collection.summary.reports) {
    if (!report.isRelevant) continue
    for (const scope of report.scopes) repos.add(scope.repository)
  }
  return [...repos].sort()
}

export function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(file, 'utf8')) as T
}
