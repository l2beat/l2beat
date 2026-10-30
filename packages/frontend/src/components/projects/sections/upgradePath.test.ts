import { expect } from 'earl'
import { isWaitingStep, parseUpgradePath } from './upgradePath'

// Why: config authors write upgrade paths as free text, and the timeline must
// split them where they mean a step boundary and nowhere else.
// How: feed strings shaped like the real configs and compare the parsed steps.
describe(parseUpgradePath.name, () => {
  it('keeps unspaced arrows inside a step and splits off trailing remarks', () => {
    expect(
      parseUpgradePath(
        'Forum temp-check → L2→L1 outbox (~6.4d) → execute. Total wall-clock ≈ 41 days.',
      ),
    ).toEqual({
      steps: ['Forum temp-check', 'L2→L1 outbox (~6.4d)', 'Execute'],
      note: 'Total wall-clock ≈ 41 days.',
    })
  })

  it('drops the final period when there are no remarks', () => {
    expect(parseUpgradePath('wait 7d → execution within 14d (~6.4d).')).toEqual(
      { steps: ['Wait 7d', 'Execution within 14d (~6.4d)'] },
    )
  })

  it('returns undefined for prose without step arrows', () => {
    expect(
      parseUpgradePath('**~17.4d** non-emergency, L2→L1 outbox included.'),
    ).toEqual(undefined)
  })
})

// Why: waits are where users get time to exit, so the timeline must mark every
// form the configs use for one, without catching steps that only mention them.
// How: run real step texts from the configs through the predicate.
describe(isWaitingStep.name, () => {
  it('matches waits and veto windows but not actions', () => {
    const waits = [
      'Wait 7d',
      'L2 Timelock (8d)',
      'L2→L1 outbox (~6.4d)',
      '12d voting delay',
      '**7-day veto window** during which Token House can veto',
      '**7d token-holder veto period**',
      '1d Guardian offchain-veto window',
    ]
    const actions = [
      'Collect **500.00K RAIL** sponsorship within 1mo',
      'If not vetoed, SC + Foundation Upgrade Safe co-sign the L1 transaction',
    ]
    expect(waits.filter((step) => !isWaitingStep(step))).toEqual([])
    expect(actions.filter(isWaitingStep)).toEqual([])
  })
})
