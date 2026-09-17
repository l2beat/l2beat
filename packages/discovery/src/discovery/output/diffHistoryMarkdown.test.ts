import { describe, expect, it } from 'vitest'
import { countDiffChanges } from './diffHistoryMarkdown'

function diffBody(...lines: string[]): string {
  return ['```diff', ...lines, '```'].join('\n')
}

describe(countDiffChanges.name, () => {
  it('counts a contiguous +/- run as one change', () => {
    expect(
      countDiffChanges(diffBody('      values.$upgradeCount:', '-        3')),
    ).toBe(1)
    expect(
      countDiffChanges(
        diffBody('      values.$upgradeCount:', '-        3', '+        5'),
      ),
    ).toBe(1)
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
    ).toBe(1)
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
    ).toBe(2)
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
    ).toBe(1)
  })
})
