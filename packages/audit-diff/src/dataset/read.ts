import { existsSync, readFileSync } from 'fs'
import path from 'path'
import type {
  AuditSummaryJson,
  DeployedJson,
  ManifestJson,
  ManifestSource,
} from './types.js'

/** A directory with audit-summary.json and audited-sources/: a project or a libs/<vendor>. */
export interface AuditedSourcesDir {
  dir: string
  summary: AuditSummaryJson
  manifest: ManifestJson
}

export interface ProjectDir extends AuditedSourcesDir {
  deployed: DeployedJson
}

export function hasAuditSummary(dir: string): boolean {
  return existsSync(path.join(dir, 'audit-summary.json'))
}

export function readAuditedSourcesDir(dir: string): AuditedSourcesDir {
  const summary = readJson<AuditSummaryJson>(
    path.join(dir, 'audit-summary.json'),
  )
  const manifestPath = path.join(dir, 'audited-sources', 'manifest.json')
  const manifest = existsSync(manifestPath)
    ? readJson<ManifestJson>(manifestPath)
    : { sources: [] }
  return { dir, summary, manifest }
}

export function readProjectDir(dir: string): ProjectDir {
  const deployed = readJson<DeployedJson>(path.join(dir, 'deployed.json'))
  return { ...readAuditedSourcesDir(dir), deployed }
}

/** Reads a file referenced from `manifest.sources[].files[].file`. */
export function readAuditedFile(dir: string, file: string): string {
  return readFileSync(path.join(dir, 'audited-sources', file), 'utf8')
}

/** Reads a file referenced from `deployed.json` `sourceFiles`. */
export function readDeployedFile(dir: string, file: string): string {
  return readFileSync(path.join(dir, file), 'utf8')
}

/** Finds the fetched files for one audited (repository, path, commit). */
export function findManifestSource(
  manifest: ManifestJson,
  repository: string,
  sourcePath: string,
  commit: string,
): ManifestSource | undefined {
  return manifest.sources.find(
    (s) =>
      s.repository === repository &&
      s.source_path === sourcePath &&
      s.commit === commit,
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

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(file, 'utf8')) as T
}
