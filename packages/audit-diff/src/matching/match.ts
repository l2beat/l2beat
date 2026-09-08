import type { UnitKind, UnitWarning } from '../contract/schema.js'
import { lineSimilarity, withNamePlaceholder } from '../diffing/similarity.js'
import type { ExtractedUnit } from '../solidity/extractUnits.js'
import type { AuditedIndex, AuditedUnitVersion } from './index.js'

/** A name match below this is probably an unrelated unit with the same name. */
const NAME_MATCH_MIN_SIMILARITY = 0.3
/** A renamed unit must be at least this similar to be accepted. */
const RENAME_MIN_SIMILARITY = 0.6
/**
 * Minimum number of body lines for the rename heuristic. With comments
 * removed, tiny interfaces consist of a declaration, one function and a
 * closing brace and would all look alike.
 */
const RENAME_MIN_BODY_LINES = 6

export interface MatchResult {
  index: AuditedIndex
  auditedName: string
  matchedBy: 'name' | 'alias' | 'similarity'
  /** Newest first. */
  versions: AuditedUnitVersion[]
  /** Best similarity over all versions. */
  similarity: number
  warnings: UnitWarning[]
}

/**
 * Finds the audited unit a deployed unit corresponds to.
 *
 * Precedence: alias → exact name in the project's own audits → exact name in
 * standard libraries → rename heuristic in the project's own audits →
 * low-similarity name match kept with a warning. Libraries are matched by
 * exact name only; with hundreds of similar vendor files a similarity search
 * would produce false positives, and vendor unit names are stable.
 */
export function matchUnit(
  deployed: ExtractedUnit,
  /** Comparable non-empty lines of the deployed unit (see normalize.ts). */
  deployedComparable: string,
  project: AuditedIndex,
  libraries: AuditedIndex[],
  aliases: Record<string, string>,
): MatchResult | undefined {
  if (deployed.kind === 'file-level') return undefined

  const alias = aliases[deployed.name]
  if (alias) {
    const versions = project.units.get(alias)
    if (versions) {
      return result(
        project,
        alias,
        'alias',
        versions,
        deployedComparable,
        deployed,
      )
    }
  }

  const byName = tryName(project, deployed, deployedComparable)
  if (byName && byName.similarity >= NAME_MATCH_MIN_SIMILARITY) return byName

  let bestLibrary: MatchResult | undefined
  for (const library of libraries) {
    const candidate = tryName(library, deployed, deployedComparable)
    if (
      candidate &&
      candidate.similarity >= NAME_MATCH_MIN_SIMILARITY &&
      (!bestLibrary || candidate.similarity > bestLibrary.similarity)
    ) {
      bestLibrary = candidate
    }
  }
  if (bestLibrary) return bestLibrary

  const renamed = tryRename(project, deployed, deployedComparable)
  if (renamed) return renamed

  if (byName) {
    byName.warnings.push('low-similarity')
    return byName
  }
  return undefined
}

function tryName(
  index: AuditedIndex,
  deployed: ExtractedUnit,
  deployedComparable: string,
): MatchResult | undefined {
  const versions = index.units.get(deployed.name)
  if (!versions) return undefined
  return result(
    index,
    deployed.name,
    'name',
    versions,
    deployedComparable,
    deployed,
  )
}

/**
 * Scores every audited unit of a compatible kind against the deployed unit
 * with both names replaced by a placeholder, so `contract Tornado` and
 * `contract Mixer` with the same body compare as equal.
 */
function tryRename(
  index: AuditedIndex,
  deployed: ExtractedUnit,
  deployedComparable: string,
): MatchResult | undefined {
  const deployedBody = bodyLines(deployedComparable)
  if (deployedBody.split('\n').length < RENAME_MIN_BODY_LINES) return undefined
  const anonymousDeployed = withNamePlaceholder(deployedBody, deployed.name)
  let best:
    | { name: string; versions: AuditedUnitVersion[]; similarity: number }
    | undefined

  for (const [name, versions] of index.units) {
    const newest = versions[0]
    if (!newest || !kindsCompatible(deployed.kind, newest.unit.kind)) continue
    const similarity = lineSimilarity(
      anonymousDeployed,
      withNamePlaceholder(bodyLines(newest.comparableLines), name),
    )
    if (
      similarity >= RENAME_MIN_SIMILARITY &&
      (!best || similarity > best.similarity)
    ) {
      best = { name, versions, similarity }
    }
  }
  if (!best) return undefined

  const res = result(
    index,
    best.name,
    'similarity',
    best.versions,
    deployedComparable,
    deployed,
  )
  res.similarity = best.similarity
  return res
}

function result(
  index: AuditedIndex,
  auditedName: string,
  matchedBy: MatchResult['matchedBy'],
  versions: AuditedUnitVersion[],
  deployedComparable: string,
  deployed: ExtractedUnit,
): MatchResult {
  let similarity = 0
  for (const version of versions) {
    similarity = Math.max(
      similarity,
      lineSimilarity(deployedComparable, version.comparableLines),
    )
    if (similarity === 1) break
  }
  const warnings: UnitWarning[] = []
  const newest = versions[0]
  if (newest && !kindsCompatible(deployed.kind, newest.unit.kind)) {
    warnings.push('kind-mismatch')
  }
  return { index, auditedName, matchedBy, versions, similarity, warnings }
}

/** Drops the declaration line and lone braces, which every unit shares. */
function bodyLines(comparableLines: string): string {
  return comparableLines
    .split('\n')
    .slice(1)
    .filter((line) => line !== '}' && line !== '{')
    .join('\n')
}

/** Old code declares interfaces as `contract`; abstract vs contract changes too. */
function kindsCompatible(a: UnitKind, b: UnitKind): boolean {
  if (a === b) return true
  const contractLike = new Set<UnitKind>(['contract', 'abstract', 'interface'])
  return contractLike.has(a) && contractLike.has(b)
}
