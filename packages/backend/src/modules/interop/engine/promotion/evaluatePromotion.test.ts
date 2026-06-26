import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { evaluatePromotion } from './evaluatePromotion'
import type { PromotionContext, PromotionRule } from './types'

const ctx: PromotionContext = {
  timestamp: UnixTime(100),
  transfers: [],
  tokens: [],
}

describe(evaluatePromotion.name, () => {
  it('unions violations from all rules', () => {
    const rules: PromotionRule[] = [
      {
        name: 'r1',
        evaluate: () => [{ rule: 'r1', scope: '*', message: 'a' }],
      },
      {
        name: 'r2',
        evaluate: () => [{ rule: 'r2', scope: 'x', message: 'b' }],
      },
    ]
    const { violations, ruleErrors } = evaluatePromotion(ctx, rules)
    expect(violations).toHaveLength(2)
    expect(ruleErrors).toEqual([])
  })

  it('isolates a throwing rule into ruleErrors and keeps the rest', () => {
    const rules: PromotionRule[] = [
      {
        name: 'boom',
        evaluate: () => {
          throw new Error('kaboom')
        },
      },
      {
        name: 'ok',
        evaluate: () => [{ rule: 'ok', scope: '*', message: 'c' }],
      },
    ]
    const { violations, ruleErrors } = evaluatePromotion(ctx, rules)
    expect(violations).toHaveLength(1)
    expect(ruleErrors).toEqual([{ rule: 'boom', error: 'kaboom' }])
  })
})
