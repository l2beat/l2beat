import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
} from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'

/** Input a rule sees: one aggregate snapshot, in memory. */
export interface PromotionContext {
  timestamp: UnixTime
  transfers: AggregatedInteropTransferRecord[]
  tokens: AggregatedInteropTokenRecord[]
}

/**
 * Unified envelope every analyzer emits. The cross-cutting machinery only ever
 * reads the analyzer-independent fields. `scope` is a deterministic subject id
 * (lane key or `*`); `value`/`threshold` are for the message/display only.
 */
export interface RuleViolation {
  rule: string
  scope: string
  value?: number
  threshold?: number
  message: string
}

export interface PromotionRule {
  name: string
  evaluate(ctx: PromotionContext): RuleViolation[]
}

export interface RuleError {
  rule: string
  error: string
}

export interface PromotionEvaluation {
  violations: RuleViolation[]
  ruleErrors: RuleError[]
}
