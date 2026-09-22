import { expect } from 'earl'
import type { Plan, Step } from '../plan/Plan'
import { fixturePlan } from '../testing/fixturePlan'
import { decisionHash, decisionsOf } from './decisionHash'
import { planHash } from './planHash'

/**
 * Takes the fixture plan and varies one thing at a time: the free-text
 * `reason` of a step, the order of steps and skips, a skip's closed reason,
 * a step's fetch. The first two must not move the hash (they are wording
 * and layout, which the two real ScrollChain runs differed in); the last
 * two must (they are rulings). `planHash` is asserted to see the wording
 * change, so the two hashes are shown to measure different things.
 */
describe(decisionHash.name, () => {
  it('ignores step reasons, which planHash does not', () => {
    const a = fixturePlan()
    const b = reworded(fixturePlan())
    expect(decisionHash(a)).toEqual(decisionHash(b))
    expect(planHash(a)).not.toEqual(planHash(b))
  })

  it('ignores the order of steps and of skips', () => {
    const a = fixturePlan()
    const b: Plan = {
      ...fixturePlan(),
      steps: [...fixturePlan().steps].reverse(),
      skips: [...fixturePlan().skips].reverse(),
    }
    expect(decisionHash(a)).toEqual(decisionHash(b))
  })

  it('changes with a skip reason, because that is a verdict', () => {
    const a = fixturePlan()
    const b = fixturePlan()
    const skip = b.skips.find((s) => s.item === 'balanceOf(address)')
    if (skip === undefined) throw new Error('fixture changed')
    skip.reason = 'unbounded'
    expect(decisionHash(a)).not.toEqual(decisionHash(b))
  })

  it('changes with a fetch, a recipe argument, a cover or the contract', () => {
    const base = decisionHash(fixturePlan())
    const variants: Plan[] = [
      withStep(1, (step) => ({
        ...step,
        fetch: { kind: 'logs', events: ['OwnershipTransferred'] },
      })),
      withStep(1, (step) => ({
        ...step,
        args: { ...step.args, key: 'other' },
      })),
      withStep(1, (step) => ({ ...step, covers: [] })),
      { ...fixturePlan(), contract: 'Other' },
    ]
    for (const plan of variants) {
      expect(decisionHash(plan)).not.toEqual(base)
    }
  })

  it('exposes the canonical decisions without reasons and in sorted order', () => {
    const decisions = decisionsOf(fixturePlan())
    expect(decisions.steps.map((step) => step.id)).toEqual(
      [...fixturePlan().steps.map((step) => step.id)].sort(),
    )
    expect(decisions.steps.every((step) => !('reason' in step))).toEqual(true)
    expect(decisions.skips.map((skip) => skip.item)).toEqual(
      [...fixturePlan().skips.map((skip) => skip.item)].sort(),
    )
    expect(decisions.skips.every((skip) => 'reason' in skip)).toEqual(true)
  })
})

function withStep(index: number, change: (step: Step) => Step): Plan {
  const plan = fixturePlan()
  return {
    ...plan,
    steps: plan.steps.map((step, i) => (i === index ? change(step) : step)),
  }
}

function reworded(plan: Plan): Plan {
  return {
    ...plan,
    steps: plan.steps.map((step, i) => ({
      ...step,
      reason: `a different sentence number ${i}`,
    })),
  }
}
