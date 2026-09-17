import type { UnitKind, UnitWarning } from '../contract/schema.js'
import { countLines } from '../diffing/normalize.js'
import {
  lineMatchMetrics,
  lineSimilarity,
  withNamePlaceholder,
} from '../diffing/similarity.js'
import {
  type AuditedUnitVersion,
  commonSuffixLength,
  type EvidenceIndex,
  pathKey,
} from '../evidence/index.js'
import type { PreparedUnit } from '../evidence/units.js'
import { RANK, type RankingContext, rankOf } from './context.js'
import { selectVersion, type VersionSelection } from './select.js'

/** Same-name evidence from a related collection can represent a distant version. */
export const MIN_RELATED_NAME_SCORE = 0.55
/** Same-name evidence from an unrelated collection needs stronger code evidence. */
export const MIN_OTHER_NAME_SCORE = 0.7
/** Renamed units have no name evidence and therefore keep a stricter cutoff. */
export const MIN_RENAME_SCORE = 0.65
/** Within this score band the closer collection (lower rank) wins. */
export const RANK_TIE_BAND = 0.05
/** Renamed candidates with very different sizes are not worth diffing. */
export const MIN_RENAME_SIZE_SIMILARITY = 0.5
/** Whole-file candidates must share at least this many trailing path segments. */
export const PATH_MIN_COMMON_SEGMENTS = 2
/** Whole-file matching still uses its path-specific line-similarity rule. */
export const WHOLE_FILE_MIN_SIMILARITY = 0.3

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
 * 2. compile a union of same-name candidates from every collection and
 *    similarity candidates from own, upstream, stack and library collections;
 * 3. score every compatible version, with name used only as a small bonus;
 * 4. accept the best candidate above the threshold for its provenance;
 * 5. otherwise leave the unit unaudited.
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

  return resolveFromCandidates(unit, evidence, context)
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

interface Candidate {
  collection: string
  name: string
  versions: AuditedUnitVersion[]
  matchedBy: Exclude<MatchedBy, 'identity'>
}

interface ScoredCandidate {
  candidate: Candidate
  selection: VersionSelection
  rank: number
}

function resolveFromCandidates(
  unit: PreparedUnit,
  evidence: EvidenceIndex,
  context: RankingContext,
): Resolution | undefined {
  const candidates = collectCandidates(unit, evidence, context)
  const scored: ScoredCandidate[] = []
  for (const candidate of candidates) {
    const selection = scoreVersions(unit, candidate)
    if (!selection) continue
    const rank = rankOf(context, candidate.collection)
    if (selection.similarity < minMatchScore(rank, candidate.matchedBy)) {
      continue
    }
    scored.push({ candidate, selection, rank })
  }
  scored.sort(
    (a, b) =>
      b.selection.similarity - a.selection.similarity || a.rank - b.rank,
  )
  const top = scored[0]
  if (!top) return undefined
  let winner = top
  for (const candidate of scored) {
    if (
      candidate.rank < winner.rank &&
      top.selection.similarity - candidate.selection.similarity <= RANK_TIE_BAND
    ) {
      winner = candidate
    }
  }
  return {
    collection: winner.candidate.collection,
    auditedName: winner.candidate.name,
    matchedBy: winner.candidate.matchedBy,
    versions: winner.candidate.versions,
    selection: winner.selection,
    warnings: kindWarnings(unit.kind, winner.selection.version.kind),
  }
}

function collectCandidates(
  unit: PreparedUnit,
  evidence: EvidenceIndex,
  context: RankingContext,
): Candidate[] {
  const candidates = new Map<string, Candidate>()
  const add = (
    collection: string,
    name: string,
    versions: AuditedUnitVersion[],
    matchedBy: Candidate['matchedBy'],
  ) => {
    if (versions.length === 0) return
    const key = `${collection}\0${name}`
    const existing = candidates.get(key)
    if (existing) {
      if (matchedBy === 'alias' || existing.matchedBy === 'similarity') {
        existing.matchedBy = matchedBy
      }
      return
    }
    candidates.set(key, { collection, name, versions, matchedBy })
  }

  const namedCandidates: [string, Candidate['matchedBy']][] = [
    [unit.name, 'name'],
  ]
  const alias = context.aliases[unit.name]
  if (alias && alias !== unit.name) namedCandidates.push([alias, 'alias'])
  for (const [name, matchedBy] of namedCandidates) {
    for (const collection of evidence.collectionsDeclaring(name)) {
      add(
        collection,
        name,
        evidence.collection(collection)?.units.get(name) ?? [],
        matchedBy,
      )
    }
  }

  // Similarity candidates are bounded to collections with an explicit
  // relationship to the project, including known library collections.
  for (const ranked of context.ranked.values()) {
    if (ranked.rank > RANK.library) continue
    const index = evidence.collection(ranked.id)
    if (!index) continue
    for (const [name, versions] of index.units) {
      add(ranked.id, name, versions, 'similarity')
    }
  }
  return [...candidates.values()]
}

function scoreVersions(
  unit: PreparedUnit,
  candidate: Candidate,
): VersionSelection | undefined {
  let best: VersionSelection | undefined
  for (const version of candidate.versions) {
    if (!unitsCompatible(unit, version)) continue
    const score = matchScore(
      unit,
      version,
      candidate.matchedBy !== 'similarity',
    )
    if (score === undefined || (best && score <= best.similarity)) continue
    best = {
      version,
      identical: false,
      similarity: score,
      laterAuditedVersionExists: version !== candidate.versions[0],
    }
  }
  return best
}

function matchScore(
  deployed: PreparedUnit,
  audited: AuditedUnitVersion,
  nameOrAliasMatch: boolean,
): number | undefined {
  const deployedCode = comparisonLines(deployed.comparableLines, deployed.name)
  const auditedCode = comparisonLines(audited.comparableLines, audited.name)
  const deployedLines = countLines(deployedCode)
  const auditedLines = countLines(auditedCode)
  const sizeSimilarity =
    deployedLines === 0 && auditedLines === 0
      ? 1
      : Math.min(deployedLines, auditedLines) /
        Math.max(deployedLines, auditedLines)
  const deployedSignatures = new Set(deployed.signatures)
  const auditedSignatures = new Set(audited.signatures)
  const signaturesAvailable =
    deployedSignatures.size > 0 || auditedSignatures.size > 0

  if (!nameOrAliasMatch) {
    if (sizeSimilarity < MIN_RENAME_SIZE_SIMILARITY) return undefined
    // Do not match empty/tiny declarations merely because their skeletons are
    // alike. Tiny units need at least one signature on either side.
    if (
      deployedLines < 3 &&
      auditedLines < 3 &&
      deployed.signatures.length === 0 &&
      audited.signatures.length === 0
    ) {
      return undefined
    }
  }

  const lines = lineMatchMetrics(deployedCode, auditedCode)
  let evidenceScore =
    0.4 * lines.similarity + 0.3 * lines.containment + 0.1 * sizeSimilarity
  let evidenceWeight = 0.8
  if (signaturesAvailable) {
    evidenceScore +=
      0.2 * signatureJaccard(deployedSignatures, auditedSignatures)
    evidenceWeight += 0.2
  }
  const nameBonus = nameOrAliasMatch ? 0.05 : 0
  return Math.min(1, evidenceScore / evidenceWeight + nameBonus)
}

/**
 * zk programs, circuits and other non-Solidity files: identity first, then
 * audited files sharing the longest path suffix (at least two segments) in
 * ranked collections, highest similarity above WHOLE_FILE_MIN_SIMILARITY.
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
    if (similarity < WHOLE_FILE_MIN_SIMILARITY) continue
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

export function minMatchScore(
  rank: number,
  matchedBy: Exclude<MatchedBy, 'identity'>,
): number {
  if (matchedBy === 'similarity') return MIN_RENAME_SCORE
  return rank >= RANK.other ? MIN_OTHER_NAME_SCORE : MIN_RELATED_NAME_SCORE
}

/** Normalizes the unit's own name and drops lone braces shared by every unit. */
function comparisonLines(comparableLines: string, name: string): string {
  return withNamePlaceholder(comparableLines, name)
    .split('\n')
    .filter((line) => line !== '}' && line !== '{')
    .join('\n')
}

function signatureJaccard(a: Set<string>, b: Set<string>): number {
  let common = 0
  for (const x of a) if (b.has(x)) common++
  return common / (a.size + b.size - common)
}

/**
 * Interfaces normally cannot match implementations. The exception is a
 * signature-free namespace such as Safe's `Enum`, which old Solidity code
 * declared interchangeably as an interface, abstract contract or contract.
 */
export function unitsCompatible(
  deployed: Pick<PreparedUnit, 'kind' | 'signatures'>,
  audited: Pick<PreparedUnit, 'kind' | 'signatures'>,
): boolean {
  if (kindsCompatible(deployed.kind, audited.kind)) return true
  const namespaceKinds = new Set<UnitKind>([
    'contract',
    'abstract',
    'interface',
  ])
  return (
    namespaceKinds.has(deployed.kind) &&
    namespaceKinds.has(audited.kind) &&
    deployed.signatures.length === 0 &&
    audited.signatures.length === 0
  )
}

/** Abstract and concrete contracts are interchangeable; interfaces are not. */
export function kindsCompatible(a: UnitKind, b: UnitKind): boolean {
  if (a === b) return true
  const contractLike = new Set<UnitKind>(['contract', 'abstract'])
  return contractLike.has(a) && contractLike.has(b)
}

function kindWarnings(
  deployed: UnitKind,
  audited: UnitKind | undefined,
): UnitWarning[] {
  return audited && !kindsCompatible(deployed, audited) ? ['kind-mismatch'] : []
}
