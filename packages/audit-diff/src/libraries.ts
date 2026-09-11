import { existsSync, readdirSync, statSync } from 'fs'
import path from 'path'
import { hasAuditSummary, readAuditedSourcesDir } from './dataset/read.js'
import {
  type AuditedIndex,
  buildAuditedIndex,
  type IndexLog,
} from './matching/index.js'

/** Standard library directory names, first existing one wins. */
const LIBS_DIR_NAMES = ['_libs', 'libs']

/**
 * Builds one audited unit index per `_libs/<vendor>/` directory that has an
 * audit-summary.json. Vendors with reports only are skipped and picked up
 * automatically once their summary exists.
 */
export function loadLibraryIndexes(
  datasetDir: string,
  log: (message: string) => void,
): AuditedIndex[] {
  const libsName = LIBS_DIR_NAMES.find((n) =>
    existsSync(path.join(datasetDir, n)),
  )
  if (!libsName) {
    log('no standard library directory found')
    return []
  }
  const libsDir = path.join(datasetDir, libsName)

  const indexes: AuditedIndex[] = []
  for (const name of readdirSync(libsDir).sort()) {
    const dir = path.join(libsDir, name)
    if (!statSync(dir).isDirectory()) continue
    if (!hasAuditSummary(dir)) {
      log(`${libsName}/${name}: no audit-summary.json, skipped`)
      continue
    }
    const data = readAuditedSourcesDir(dir)
    const indexLog: IndexLog = { skippedVersions: [], parseErrors: [] }
    const index = buildAuditedIndex(
      data,
      'library',
      `${libsName}/${name}`,
      { id: name, name: data.summary.project },
      indexLog,
    )
    for (const line of indexLog.parseErrors)
      log(`${libsName}/${name} parse error: ${line}`)
    log(
      `${libsName}/${name}: ${index.units.size} unit names, ${index.programFiles.size} program files, ${indexLog.skippedVersions.length} versions without sources`,
    )
    indexes.push(index)
  }
  return indexes
}
