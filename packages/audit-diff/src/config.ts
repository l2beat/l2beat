import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

export interface ProjectConfig {
  /** L2BEAT slug when it differs from the project id. */
  slug?: string
  /** Dataset collection holding the project's own audits, when not named like the project. */
  collection?: string
  /** Deployed unit name → audited unit name, for renamed contracts. */
  aliases?: Record<string, string>
}

export interface Config {
  /** Base URL used to link audit report files, e.g. .../blob/main */
  datasetRepoUrl?: string
  /**
   * Discovery template vendor or `vendor/Template` → collection id(s). A hint
   * ranks the collection as `stack` for projects using the template; missing
   * hints never cause misses. Unlisted vendors default to a collection with
   * the same name when one exists.
   */
  collectionHints?: Record<string, string | string[]>
  projects?: Record<string, ProjectConfig>
}

export function packageDir(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
}

export function readConfig(
  file = path.join(packageDir(), 'audit-diff.config.json'),
): Config {
  if (!existsSync(file)) return {}
  return JSON.parse(readFileSync(file, 'utf8')) as Config
}
