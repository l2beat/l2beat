import { expect } from 'earl'
import {
  countDiffChanges,
  isImplementationChangeDiffBody,
} from './diffHistoryMarkdown'

function diffBody(...lines: string[]): string {
  return ['```diff', ...lines, '```'].join('\n')
}

describe(countDiffChanges.name, () => {
  it('counts a contiguous +/- run as one change', () => {
    expect(
      countDiffChanges(diffBody('      values.$upgradeCount:', '-        3')),
    ).toEqual(1)
    expect(
      countDiffChanges(
        diffBody('      values.$upgradeCount:', '-        3', '+        5'),
      ),
    ).toEqual(1)
    expect(
      countDiffChanges(
        diffBody(
          '      values.members:',
          '-        "eth:0xold1"',
          '-        "eth:0xold2"',
          '+        "eth:0xnew1"',
          '+        "eth:0xnew2"',
        ),
      ),
    ).toEqual(1)
  })

  it('starts a new change after a context line', () => {
    expect(
      countDiffChanges(
        diffBody(
          '      values.$members.0:',
          '-        "eth:0xold1"',
          '+        "eth:0xnew1"',
          '      values.$members.3:',
          '-        "eth:0xold2"',
          '+        "eth:0xnew2"',
        ),
      ),
    ).toEqual(2)
  })

  it('ignores meta lines', () => {
    expect(
      countDiffChanges(
        diffBody(
          '+++ description: The OptimismPortal contract',
          '+++ severity: HIGH',
          '+   Status: CREATED',
        ),
      ),
    ).toEqual(1)
  })
})

describe(isImplementationChangeDiffBody.name, () => {
  it('detects a $implementation field change', () => {
    expect(
      isImplementationChangeDiffBody(
        diffBody(
          '      values.$implementation:',
          '-        "eth:0xaaa"',
          '+        "eth:0xbbb"',
        ),
      ),
    ).toEqual(true)
  })

  it('detects a legacy upgradeability.implementation change', () => {
    expect(
      isImplementationChangeDiffBody(
        diffBody(
          '      upgradeability.implementation:',
          '-        "0xaaa"',
          '+        "0xbbb"',
        ),
      ),
    ).toEqual(true)
  })

  it('detects a freshly appended $pastUpgrades entry', () => {
    expect(
      isImplementationChangeDiffBody(
        diffBody(
          '      values.$pastUpgrades.10:',
          '+        ["2026-04-21T03:26:47.000Z","0x123",["eth:0x111"]]',
        ),
      ),
    ).toEqual(true)
  })

  it('ignores "implementation" inside decoded values of another field', () => {
    // e.g. a timelock's scheduledTransactionsDecoded queueing an upgrade of a
    // different contract: queued, not executed — not a code change here.
    expect(
      isImplementationChangeDiffBody(
        diffBody(
          '      values.scheduledTransactionsDecoded.35:',
          '+        {"function":"upgrade","inputs":{"proxy":"eth:0xccc","implementation":"eth:0xddd"}}',
        ),
      ),
    ).toEqual(false)
  })

  it('ignores a representation-only $implementation rewrite', () => {
    expect(
      isImplementationChangeDiffBody(
        diffBody(
          '      values.$implementation:',
          '-        "0xAAA0000000000000000000000000000000000001"',
          '+        "eth:0xAAA0000000000000000000000000000000000001"',
        ),
      ),
    ).toEqual(false)
  })

  it('ignores $pastUpgrades format migrations and whole-array additions', () => {
    expect(
      isImplementationChangeDiffBody(
        diffBody(
          '      values.$pastUpgrades.0.2.0:',
          '-        "0x111"',
          '+        "eth:0x111"',
        ),
      ),
    ).toEqual(false)
    expect(
      isImplementationChangeDiffBody(
        diffBody(
          '      values.$pastUpgrades:',
          '+        [["2020-01-01T00:00:00.000Z","0x1",["eth:0x111"]]]',
        ),
      ),
    ).toEqual(false)
  })
})
