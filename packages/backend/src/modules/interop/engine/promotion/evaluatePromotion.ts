import type {
  PromotionContext,
  PromotionEvaluation,
  PromotionRule,
  RuleError,
  RuleViolation,
} from './types'

/**
 * Runs every rule under its own try/catch so one throwing rule is isolated (recorded
 * in `ruleErrors`) instead of blanket-failing the evaluation. Pure: no DB, no I/O.
 */
export function evaluatePromotion(
  ctx: PromotionContext,
  rules: PromotionRule[],
): PromotionEvaluation {
  const violations: RuleViolation[] = []
  const ruleErrors: RuleError[] = []
  for (const rule of rules) {
    try {
      violations.push(...rule.evaluate(ctx))
    } catch (error) {
      ruleErrors.push({
        rule: rule.name,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }
  return { violations, ruleErrors }
}
