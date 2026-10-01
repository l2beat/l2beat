/**
 * What the templatizer benchmark records, per field, per contract, per
 * project and per run.
 *
 * "V1" is the committed side: the `discovered.json` values a researcher's
 * template produced. "Generated" is what the same analyzer produces at the
 * same block with a template the templatizer authored while the committed
 * one was hidden. The verdict names are the research benchmark's
 * (`packages/discovery-v2/BENCHMARK.md`), kept so its numbers stay
 * comparable, which is why a field only the generated template has is still
 * a `v2-only` verdict.
 *
 * Every V1 field gets an *attribution* before it gets a verdict, because a
 * missed field means different things by origin: a missed proxy `$` value or
 * 0-arg getter would be a bug in the analyzer, a missed handler field is the
 * model missing an enumeration, and a missed template projection
 * (`pickRoleMembers`, `copy`, a formatted `call`) is a display convenience
 * the templatizer does not author by design. The report separates them so
 * nobody reads a "v1-only" count without knowing which kind it is.
 */
import type { StructureContract } from '../../config/StructureConfig'

export const ATTRIBUTION_KINDS = [
  'proxy',
  'getter',
  'handler',
  'template-projection',
] as const
export type AttributionKind = (typeof ATTRIBUTION_KINDS)[number]

export type V1Attribution =
  | { kind: 'proxy' }
  | { kind: 'getter'; edited?: true }
  | { kind: 'handler'; handlerType: string }
  | {
      kind: 'template-projection'
      via: 'pickRoleMembers' | 'edit' | 'copy'
      handlerType?: string
    }

/** The committed template merged under the address override, as V1 applied it to the entry. */
export type EffectiveConfig = Pick<
  StructureContract,
  'fields' | 'ignoreMethods'
>

export const V2_ONLY_CLASSES = ['ignored-by-v1', 'new'] as const
export type V2OnlyClass = (typeof V2_ONLY_CLASSES)[number]

export type FieldVerdict =
  | { verdict: 'equal'; name: string; attribution: V1Attribution }
  | {
      verdict: 'equal-renamed'
      name: string
      generatedName: string
      attribution: V1Attribution
    }
  | {
      /** Every value V1 held is in the generated values, under another structure or key. */
      verdict: 'equal-by-value'
      name: string
      /** Generated fields whose values contained V1's; the namesake alone when the shape differs. */
      generatedNames: string[]
      attribution: V1Attribution
    }
  | {
      verdict: 'different'
      name: string
      attribution: V1Attribution
      diff: string
    }
  | { verdict: 'v1-only'; name: string; attribution: V1Attribution }
  | { verdict: 'v2-only'; name: string; class: V2OnlyClass }

export interface TokenUsage {
  input: number
  cached: number
  output: number
  reasoning: number
}

export interface VerdictCounts {
  v1Fields: number
  generatedFields: number
  equal: number
  equalRenamed: number
  equalByValue: number
  different: number
  v1Only: Record<AttributionKind, number>
  v2Only: Record<V2OnlyClass, number>
  /** V1 fields a researcher wrote a handler for: the only part a model can move. */
  handlerFields: number
  /** Of those, the ones the generated values hold, under any name or shape. */
  handlerFound: number
}

/** What the loop's `summary.json` says about one contract's authoring. */
export interface TrailSummary {
  status: string
  failure?: string
  model?: string
  rounds: number
  tokens: TokenUsage
  /** Time spent inside model turns. */
  modelMs: number
  /** Why the client refused the last turn, when it did: where quota and rate limits surface. */
  lastRefusal?: string
}

/**
 * Which template the generated values came from. `matched` means another
 * committed template has the same shape, so the templatizer never ran: that
 * is a finding about the templates, not about the model.
 */
export type AuthoringOutcome =
  | { kind: 'authored'; template: string }
  | { kind: 'matched'; template: string }
  | { kind: 'failed'; failure: string }

export interface ContractBenchmark {
  address: string
  name?: string
  /** The committed template, hidden from the templatizer for this contract. */
  committedTemplate: string
  status: 'compared' | 'failed' | 'skipped'
  /** Why the contract was not compared: what threw, or why it was skipped. */
  error?: string
  /** Present exactly when the contract was compared. */
  authoring?: AuthoringOutcome
  model?: string
  rounds: number
  /** Why the client refused the last model turn, when it did. */
  refusal?: string
  tokens: TokenUsage
  /** Whole analysis of this contract, RPC and model included. */
  wallMs: number
  modelMs: number
  fields: FieldVerdict[]
  counts: VerdictCounts
}

export interface ProjectTotals extends VerdictCounts {
  contracts: number
  compared: number
  failed: number
  skipped: number
  authored: number
  matched: number
  authoringFailed: number
  tokens: TokenUsage
  wallMs: number
  modelMs: number
  /** How many contracts needed 1, 2, … model turns (contracts without a model call are not counted). */
  roundsDistribution: Record<string, number>
}

export interface ProjectBenchmark {
  project: string
  chain: string
  /** The committed `usedBlockNumbers[chain]`, which every value was read at. */
  blockNumber?: number
  /** The committed `discovered.json` timestamp the provider was built from. */
  timestamp?: number
  /** Why no contract of the project could run (unreadable config, provider at another block). */
  failure?: string
  contracts: ContractBenchmark[]
  totals: ProjectTotals
}

export interface BenchmarkReport {
  /** The model as asked for on the command line. */
  model: string
  /** The model the client reported for the first authored contract, when it reports one. */
  reportedModel?: string
  maxRounds: number
  startedAt: string
  finishedAt: string
  projects: ProjectBenchmark[]
  totals: ProjectTotals
}
