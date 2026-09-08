import { existsSync, readdirSync, statSync } from 'fs'
import path from 'path'
import { hasAuditSummary, readAuditedSourcesDir } from './dataset/read.js'
import {
  type AuditedIndex,
  buildAuditedIndex,
  type IndexLog,
} from './matching/index.js'

/**
 * Builds one audited unit index per `libs/<vendor>/` directory that has an
 * audit-summary.json. Vendors with reports only are skipped and picked up
 * automatically once their summary exists.
 */
export function loadLibraryIndexes(
  datasetDir: string,
  log: (message: string) => void,
): AuditedIndex[] {
  const libsDir = path.join(datasetDir, 'libs')
  if (!existsSync(libsDir)) return []

  const indexes: AuditedIndex[] = []
  for (const name of readdirSync(libsDir).sort()) {
    const dir = path.join(libsDir, name)
    if (!statSync(dir).isDirectory()) continue
    if (!hasAuditSummary(dir)) {
      log(`libs/${name}: no audit-summary.json, skipped`)
      continue
    }
    const data = readAuditedSourcesDir(dir)
    const indexLog: IndexLog = { skippedVersions: [], parseErrors: [] }
    const index = buildAuditedIndex(
      data,
      'library',
      `libs/${name}`,
      { id: name, name: data.summary.project },
      indexLog,
    )
    for (const line of indexLog.parseErrors)
      log(`libs/${name} parse error: ${line}`)
    log(
      `libs/${name}: ${index.units.size} unit names, ${indexLog.skippedVersions.length} versions without sources`,
    )
    indexes.push(index)
  }
  return indexes
}
