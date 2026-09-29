import type {
  ContextCollection,
  MatchOrigin,
  MatchRelation,
} from '../contract/schema.js'
import { ancestors } from '../dataset/registry.js'
import { sha256 } from '../deployed/format.js'
import type { EvidenceIndex } from '../evidence/index.js'

export const RANK: Record<MatchOrigin, number> = {
  own: 0,
  upstream: 1,
  stack: 2,
  library: 3,
  other: 4,
}

export const ORIGIN_BY_RANK: MatchOrigin[] = [
  'own',
  'upstream',
  'stack',
  'library',
  'other',
]

/**
 * Ranking of evidence collections for one project. It never limits which
 * collections are searched by name or hash; it breaks near-ties and bounds the
 * rename search (`searchSet`).
 */
export interface RankingContext {
  projectId: string
  /** Collection id → rank, origin and relation. Ranks 0..3 only. */
  ranked: Map<string, ContextCollection>
  /** Collections the rename heuristic scans: own, upstream and stack. */
  searchSet: string[]
  /** Deployed unit name → audited unit name for renamed contracts. */
  aliases: Record<string, string>
  key: string
}

export interface ContextOptions {
  projectId: string
  /** Dataset collection holding the project's own audits; defaults to projectId. */
  ownCollection?: string
  /** Templates used by the project's contracts, e.g. `opstack/L1StandardBridge`. */
  templates: string[]
  /** Template vendor or `vendor/Template` → collection id(s). */
  collectionHints: Record<string, string | string[]>
  aliases?: Record<string, string>
}

export function buildContext(
  evidence: EvidenceIndex,
  options: ContextOptions,
): RankingContext {
  const ranked = new Map<string, ContextCollection>()
  const add = (id: string, origin: MatchOrigin, relation: MatchRelation) => {
    if (!evidence.collection(id)) return
    const rank = RANK[origin]
    const existing = ranked.get(id)
    if (existing && existing.rank <= rank) return
    ranked.set(id, { id, rank, origin, relation })
  }

  const ownId = options.ownCollection ?? options.projectId
  add(ownId, 'own', { type: 'own' })

  const own = evidence.collection(ownId)
  if (own) {
    for (const repository of own.repositories) {
      for (const ancestor of ancestors(evidence.dataset.registry, repository)) {
        for (const id of evidence.collectionsReferencing(ancestor)) {
          if (id === ownId) continue
          add(id, 'upstream', { type: 'fork_of', repository: ancestor })
        }
      }
    }
  }

  for (const template of options.templates) {
    for (const id of hintedCollections(
      template,
      options.collectionHints,
      evidence,
    )) {
      add(id, 'stack', { type: 'template', template })
    }
  }

  for (const [id, index] of evidence.collections) {
    if (index.collection.kind === 'library') {
      add(id, 'library', { type: 'library' })
    }
  }

  const searchSet = [...ranked.values()]
    .filter((c) => c.rank <= RANK.stack)
    .sort((a, b) => a.rank - b.rank || a.id.localeCompare(b.id))
    .map((c) => c.id)

  const keyInput = [...ranked.values()]
    .filter((c) => c.rank <= RANK.stack)
    .map((c) => `${c.rank}:${c.id}`)
    .sort()
    .join('\n')

  return {
    projectId: options.projectId,
    ranked,
    searchSet,
    aliases: options.aliases ?? {},
    key: sha256(keyInput).slice(0, 16),
  }
}

/**
 * Collections a template points at: the `vendor/Template` hint, else the
 * `vendor` hint, else a collection named like the vendor when it exists.
 */
export function hintedCollections(
  template: string,
  hints: Record<string, string | string[]>,
  evidence: EvidenceIndex,
): string[] {
  const vendor = template.includes('/')
    ? (template.split('/')[0] ?? template)
    : template
  const hint = hints[template] ?? hints[vendor]
  if (hint !== undefined) {
    return (Array.isArray(hint) ? hint : [hint]).filter((id) =>
      evidence.collection(id),
    )
  }
  return evidence.collection(vendor) ? [vendor] : []
}

export function rankOf(context: RankingContext, collection: string): number {
  return context.ranked.get(collection)?.rank ?? RANK.other
}

export function describe(
  context: RankingContext,
  collection: string,
): { origin: MatchOrigin; relation: MatchRelation; rank: number } {
  const entry = context.ranked.get(collection)
  if (entry) {
    return { origin: entry.origin, relation: entry.relation, rank: entry.rank }
  }
  return { origin: 'other', relation: { type: 'name' }, rank: RANK.other }
}
