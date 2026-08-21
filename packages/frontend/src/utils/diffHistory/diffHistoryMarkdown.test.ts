import { expect } from 'earl'
import { countDiffChanges } from './diffHistoryMarkdown'

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
