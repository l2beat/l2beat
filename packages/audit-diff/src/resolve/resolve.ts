import type { UnitKind, UnitWarning } from '../contract/schema.js'
import { lineSimilarity, withNamePlaceholder } from '../diffing/similarity.js'
import {
  type AuditedUnitVersion,
  commonSuffixLength,
  type EvidenceIndex,
  pathKey,
} from '../evidence/index.js'
import type { PreparedUnit } from '../evidence/units.js'
import { RANK, type RankingContext, rankOf } from './context.js'
import { selectVersion, type VersionSelection } from './select.js'

/** A name match below this is probably an unrelated unit with the same name. */
export const MIN_SIM_NEAR = 0.3
/** Same-name matches from unrelated collections need more evidence. */
export const MIN_SIM_OTHER = 0.5
/** Within this similarity band the closer collection (lower rank) wins. */
export const RANK_TIE_BAND = 0.05
/** A renamed unit must be at least this similar to be accepted. */
export const RENAME_MIN_SIM = 0.6
/**
 * Minimum number of body lines for the rename heuristic. With comments
 * removed, tiny interfaces consist of a declaration, one function and a
 * closing brace and would all look alike.
 */
export const RENAME_MIN_BODY_LINES = 6
/** Rename candidates must have a comparable line count within this fraction. */
export const RENAME_LINE_BAND = 0.5
/** Rename candidates must share at least this fraction of signatures. */
export const RENAME_MIN_SIGNATURE_JACCARD = 0.5
/** Whole-file candidates must share at least this many trailing path segments. */
export const PATH_MIN_COMMON_SEGMENTS = 2

export type MatchedBy = 'identity' | 'name' | 'alias' | 'similarity'

export interface Resolution {
  collection: string
  auditedName: string
  matchedBy: MatchedBy
  /** Newest first. */
  versions: AuditedUnitVersion[]
  selection: VersionSelection
  warnings: UnitWarning[]
}

/**
 * Finds the audited unit a deployed unit corresponds to.
 *
 * 1. identity: the comparable hash exists anywhere in the dataset;
 * 2. same name in any collection, highest similarity wins, closer collection
 *    wins within RANK_TIE_BAND; thresholds depend on the collection's rank;
 * 3. rename heuristic over the context's search set (own, upstream, stack);
 * 4. a step-2 candidate below its threshold, kept with a warning;
 * 5. nothing.
 */
export function resolveUnit(
  unit: PreparedUnit,
  evidence: EvidenceIndex,
  context: RankingContext,
  /** Repository-relative path for whole-file units. */
  repoPath?: string,
): Resolution | undefined {
  if (unit.kind === 'file-level') return undefined
  if (unit.kind === 'program') {
    return resolveWholeFile(unit, evidence, context, repoPath ?? unit.name)
  }

  const identity = resolveByIdentity(unit, evidence, context)
  if (identity) return identity

  const alias = context.aliases[unit.name]
  const byName = resolveByName(unit, alias ?? unit.name, evidence, context)
  if (byName.accepted) {
    if (alias) byName.accepted.matchedBy = 'alias'
    return byName.accepted
  }

  const renamed = resolveByRename(unit, evidence, context)
  if (renamed) return renamed

  if (byName.fallback) {
    byName.fallback.warnings.push('low-similarity')
    return byName.fallback
  }
  return undefined
}

function resolveByIdentity(
  unit: PreparedUnit,
  evidence: EvidenceIndex,
  context: RankingContext,
): Resolution | undefined {
  const hits = evidence.hashIndex.get(unit.unitHash)
  if (!hits || hits.length === 0) return undefined
  // Closest collection first, then newest.
  const best = [...hits].sort(
    (a, b) =>
      rankOf(context, a.collection) - rankOf(context, b.collection) ||
      b.order - a.order,
  )[0]
  if (!best) return undefined
  const versions = versionsOf(best, evidence)
  const selection = selectVersion(unit.unitHash, unit.comparableLines, versions)
  if (!selection) return undefined
  return {
    collection: best.collection,
    auditedName: best.name,
    matchedBy: 'identity',
    versions,
    selection,
    warnings: kindWarnings(unit.kind, best.kind),
  }
}

interface NameSearch {
  accepted?: Resolution
  fallback?: Resolution
}

function resolveByName(
  unit: PreparedUnit,
  name: string,
  evidence: EvidenceIndex,
  context: RankingContext,
): NameSearch {
  const candidates: { resolution: Resolution; rank: number }[] = []
  for (const collectionId of evidence.collectionsDeclaring(name)) {
    const versions = evidence.collection(collectionId)?.units.get(name)
    if (!versions || versions.length === 0) continue
    const selection = selectVersion(
      unit.unitHash,
      unit.comparableLines,
      versions,
    )
    if (!selection) continue
    candidates.push({
      rank: rankOf(context, collectionId),
      resolution: {
        collection: collectionId,
        auditedName: name,
        matchedBy: 'name',
        versions,
        selection,
        warnings: kindWarnings(unit.kind, versions[0]?.kind),
      },
    })
  }
  if (candidates.length === 0) return {}

  const accepted = candidates.filter(
    (c) => c.resolution.selection.similarity >= minSimilarity(c.rank),
  )
  const pool = accepted.length > 0 ? accepted : candidates
  pool.sort(
    (a, b) =>
      b.resolution.selection.similarity - a.resolution.selection.similarity ||
      a.rank - b.rank,
  )
  const top = pool[0]
  if (!top) return {}
  let winner = top
  for (const candidate of pool) {
    if (
      candidate.rank < winner.rank &&
      top.resolution.selection.similarity -
        candidate.resolution.selection.similarity <=
        RANK_TIE_BAND
    ) {
      winner = candidate
    }
  }
  return accepted.length > 0
    ? { accepted: winner.resolution }
    : { fallback: winner.resolution }
}

/**
 * Scores audited units of a compatible kind in the search set against the
 * deployed unit with both names replaced by a placeholder, so `contract
 * Tornado` and `contract Mixer` with the same body compare as equal. Cheap
 * prefilters (line count band, signature overlap) run before the line diff.
 */
function resolveByRename(
  unit: PreparedUnit,
  evidence: EvidenceIndex,
  context: RankingContext,
): Resolution | undefined {
  const deployedBody = bodyLines(unit.comparableLines)
  const deployedLineCount = deployedBody.split('\n').length
  if (deployedLineCount < RENAME_MIN_BODY_LINES) return undefined
  const anonymousDeployed = withNamePlaceholder(deployedBody, unit.name)
  const deployedSignatures = new Set(unit.signatures)

  let best:
    | {
        collection: string
        name: string
        versions: AuditedUnitVersion[]
        similarity: number
      }
    | undefined

  for (const collectionId of context.searchSet) {
    const index = evidence.collection(collectionId)
    if (!index) continue
    for (const [name, versions] of index.units) {
      const newest = versions[0]
      if (!newest || !kindsCompatible(unit.kind, newest.kind)) continue
      const candidateBody = bodyLines(newest.comparableLines)
      const candidateLineCount = candidateBody.split('\n').length
      if (
        Math.abs(deployedLineCount - candidateLineCount) >
        RENAME_LINE_BAND * candidateLineCount
      ) {
        continue
      }
      if (
        jaccard(deployedSignatures, new Set(newest.signatures)) <
        RENAME_MIN_SIGNATURE_JACCARD
      ) {
        continue
      }
      const similarity = lineSimilarity(
        anonymousDeployed,
        withNamePlaceholder(candidateBody, name),
      )
      if (
        similarity >= RENAME_MIN_SIM &&
        (!best || similarity > best.similarity)
      ) {
        best = { collection: collectionId, name, versions, similarity }
      }
    }
  }
  if (!best) return undefined

  const selection = selectVersion(
    unit.unitHash,
    unit.comparableLines,
    best.versions,
  )
  if (!selection) return undefined
  // The anonymized body similarity is the evidence for the rename.
  selection.similarity = Math.max(selection.similarity, best.similarity)
  return {
    collection: best.collection,
    auditedName: best.name,
    matchedBy: 'similarity',
    versions: best.versions,
    selection,
    warnings: kindWarnings(unit.kind, best.versions[0]?.kind),
  }
}

/**
 * zk programs, circuits and other non-Solidity files: identity first, then
 * audited files sharing the longest path suffix (at least two segments) in
 * ranked collections, highest similarity above MIN_SIM_NEAR.
 */
function resolveWholeFile(
  unit: PreparedUnit,
  evidence: EvidenceIndex,
  context: RankingContext,
  repoPath: string,
): Resolution | undefined {
  const identity = resolveByIdentity(unit, evidence, context)
  if (identity) return identity

  const candidates = evidence.pathIndex.get(pathKey(repoPath)) ?? []
  let best:
    | {
        version: AuditedUnitVersion
        suffix: number
        similarity: number
        rank: number
      }
    | undefined
  for (const version of candidates) {
    const rank = rankOf(context, version.collection)
    if (rank > RANK.library) continue
    const suffix = commonSuffixLength(repoPath, version.path)
    if (suffix < PATH_MIN_COMMON_SEGMENTS) continue
    const similarity = lineSimilarity(
      unit.comparableLines,
      version.comparableLines,
    )
    if (similarity < MIN_SIM_NEAR) continue
    if (
      !best ||
      suffix > best.suffix ||
      (suffix === best.suffix && similarity > best.similarity)
    ) {
      best = { version, suffix, similarity, rank }
    }
  }
  if (!best) return undefined
  // Every version of the same audited file path in that collection.
  const versions = (
    evidence.collection(best.version.collection)?.files ?? []
  ).filter(
    (v) =>
      v.path === best?.version.path &&
      v.repository === best?.version.repository,
  )
  const selection = selectVersion(unit.unitHash, unit.comparableLines, versions)
  if (!selection) return undefined
  return {
    collection: best.version.collection,
    auditedName: best.version.name,
    matchedBy: 'name',
    versions,
    selection,
    warnings: [],
  }
}

/** All versions of the audited unit a version belongs to, newest first. */
function versionsOf(
  version: AuditedUnitVersion,
  evidence: EvidenceIndex,
): AuditedUnitVersion[] {
  const index = evidence.collection(version.collection)
  if (!index) return [version]
  if (version.kind === 'program') {
    return index.files.filter(
      (v) => v.path === version.path && v.repository === version.repository,
    )
  }
  return index.units.get(version.name) ?? [version]
}

export function minSimilarity(rank: number): number {
  return rank >= RANK.other ? MIN_SIM_OTHER : MIN_SIM_NEAR
}

/** Drops the declaration line and lone braces, which every unit shares. */
function bodyLines(comparableLines: string): string {
  return comparableLines
    .split('\n')
    .slice(1)
    .filter((line) => line !== '}' && line !== '{')
    .join('\n')
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1
  let common = 0
  for (const x of a) if (b.has(x)) common++
  return common / (a.size + b.size - common)
}

/** Old code declares interfaces as `contract`; abstract vs contract changes too. */
export function kindsCompatible(a: UnitKind, b: UnitKind): boolean {
  if (a === b) return true
  const contractLike = new Set<UnitKind>(['contract', 'abstract', 'interface'])
  return contractLike.has(a) && contractLike.has(b)
}

function kindWarnings(
  deployed: UnitKind,
  audited: UnitKind | undefined,
): UnitWarning[] {
  return audited && !kindsCompatible(deployed, audited) ? ['kind-mismatch'] : []
}
