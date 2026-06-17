import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { evaluatePromotion } from './evaluatePromotion'
import type { PromotionContext, PromotionRule, RuleViolation } from './types'

export type PromotionMode = 'off' | 'shadow' | 'enforce'

export interface InteropPromotionServiceDeps {
  statusRepository: Database['interopAggregateStatus']
  rules: PromotionRule[]
  mode: PromotionMode
  /** When the engine itself errors: block (true) or promote anyway (false). */
  failClosed: boolean
  logger: Logger
}

export interface ReconcileResult {
  status: 'promoted' | 'blocked'
  reasons: RuleViolation[]
  /** Whether a blocked-snapshot Discord alert should be sent (post-commit). */
  notify: boolean
}

const ENGINE_ERROR: RuleViolation = {
  rule: 'engineError',
  scope: '*',
  message: 'promotion evaluation failed',
}

/**
 * Owns the promote/block decision and the status write. MUST be invoked inside the
 * aggregating indexer's transaction so the status row is atomic with the aggregates.
 */
export class InteropPromotionService {
  private readonly logger: Logger

  constructor(private readonly $: InteropPromotionServiceDeps) {
    this.logger = $.logger.for(this)
  }

  async reconcile(ctx: PromotionContext): Promise<ReconcileResult> {
    if (this.$.mode === 'off') {
      return this.promote(ctx, [])
    }

    let violations: RuleViolation[] = []
    let engineError = false
    try {
      const evaluation = evaluatePromotion(ctx, this.$.rules)
      violations = evaluation.violations
      if (evaluation.ruleErrors.length > 0) {
        // isolate a broken rule: log it, keep evaluating the rest
        this.logger.warn('Promotion rule errors', {
          timestamp: ctx.timestamp,
          ruleErrors: evaluation.ruleErrors,
        })
      }
    } catch (error) {
      engineError = true
      this.logger.error('Promotion evaluation failed', {
        timestamp: ctx.timestamp,
        error,
      })
    }

    // shadow: observe only — always promote, never alert.
    if (this.$.mode === 'shadow') {
      if (violations.length > 0 || engineError) {
        this.logger.warn('Promotion shadow: snapshot would be blocked', {
          timestamp: ctx.timestamp,
          engineError,
          violations: violations.map((v) => v.message),
        })
      }
      return this.promote(ctx, violations)
    }

    // enforce
    const blocked = violations.length > 0 || (engineError && this.$.failClosed)
    if (blocked) {
      const reasons = engineError ? [ENGINE_ERROR, ...violations] : violations
      await this.$.statusRepository.upsertAuto({
        timestamp: ctx.timestamp,
        status: 'blocked',
        reasons,
      })
      this.logger.warn('Interop snapshot blocked from promotion', {
        timestamp: ctx.timestamp,
        reasons: reasons.map((r) => r.message),
      })
      return { status: 'blocked', reasons, notify: true }
    }

    return this.promote(ctx, violations)
  }

  private async promote(
    ctx: PromotionContext,
    reasons: RuleViolation[],
  ): Promise<ReconcileResult> {
    await this.$.statusRepository.upsertAuto({
      timestamp: ctx.timestamp,
      status: 'promoted',
    })
    return { status: 'promoted', reasons, notify: false }
  }
}
