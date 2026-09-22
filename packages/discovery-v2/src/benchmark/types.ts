/**
 * What the benchmark records, per field, per contract and per project.
 *
 * Every V1 field gets an *attribution* before it gets a verdict, because a
 * missed field means different things by origin: a missed proxy `$` value or
 * 0-arg getter is a bug in the deterministic tools, a missed handler field is
 * the model missing an enumeration, and a missed template projection
 * (`pickRoleMembers`, `copy`, a formatted `call`) is a V1 presentation
 * artefact V2 leaves to consumers by design. The report separates them so
 * nobody reads a "v1-only" count without knowing which kind it is.
 */
import type { PipelinePlanSource } from '../commands/pipelineCommand'
import type { PlanStatus } from '../types/EntryMeta'

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

export const V2_ONLY_CLASSES = ['ignored-by-v1', 'new'] as const
export type V2OnlyClass = (typeof V2_ONLY_CLASSES)[number]

export type FieldVerdict =
  | { verdict: 'equal'; name: string; attribution: V1Attribution }
  | {
      verdict: 'equal-renamed'
      name: string
      v2Name: string
      attribution: V1Attribution
    }
  | {
      /** Every value V1 held is in V2, under another structure or key. */
      verdict: 'equal-by-value'
      name: string
      /** V2 fields whose values contained V1's; the namesake alone when the shape differs. */
      v2Names: string[]
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

export const ENTRY_FACTS = [
  'proxyType',
  'sourceHashes',
  'sinceBlock',
  'implementationNames',
] as const
export type EntryFact = (typeof ENTRY_FACTS)[number]

export interface FactComparison {
  fact: EntryFact
  equal: boolean
  v1: unknown
  v2: unknown
}

export interface TokenUsage {
  input: number
  cached: number
  output: number
  reasoning: number
}

export interface VerdictCounts {
  v1Fields: number
  v2Fields: number
  equal: number
  equalRenamed: number
  equalByValue: number
  different: number
  v1Only: Record<AttributionKind, number>
  v2Only: Record<V2OnlyClass, number>
}

export interface RepeatAttempt {
  status: 'ok' | 'failed'
  rounds: number
  tokens: TokenUsage
  durationMs: number
  decisionHash?: string
  failure?: string
}

export interface RepeatResult {
  /** The pipeline's own plan plus every repeat that produced a plan. */
  plans: number
  distinctDecisionHashes: number
  attempts: RepeatAttempt[]
}

export type ContractPlanSource = Exclude<PipelinePlanSource, 'file'> | 'none'

export interface ContractBenchmark {
  address: string
  name?: string
  template?: string
  status: 'compared' | 'failed'
  /** Present when the pipeline threw; no comparison was possible. */
  error?: string
  planStatus?: PlanStatus
  planSource: ContractPlanSource
  planHash?: string
  decisionHash?: string
  model?: string
  rounds: number
  tokens: TokenUsage
  /** Whole pipeline for this contract, including RPC. */
  wallMs: number
  /** Time spent inside model turns. */
  modelMs: number
  authoringFailure?: string
  fields: FieldVerdict[]
  facts: FactComparison[]
  counts: VerdictCounts
  repeats?: RepeatResult
}

export interface ProjectTotals extends VerdictCounts {
  contracts: number
  compared: number
  failed: number
  tokens: TokenUsage
  wallMs: number
  modelMs: number
  /** How many contracts needed 1, 2, … model turns (contracts without a model call are not counted). */
  roundsDistribution: Record<string, number>
}

export interface ProjectBenchmark {
  project: string
  chain: string
  blockNumber: number
  provider?: string
  model?: string
  reasoning?: string
  /** Prompt strategy flags of the run. */
  review: boolean
  facts: boolean
  author: boolean
  /** Every contract ran with an empty plan (the deterministic floor). */
  noPlan: boolean
  repeat: number
  startedAt: string
  finishedAt: string
  /** Shape hashes the plan store held before the first contract ran. */
  planStoreBefore: string[]
  contracts: ContractBenchmark[]
  totals: ProjectTotals
}
