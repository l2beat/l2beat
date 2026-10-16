import { expect } from 'earl'
import { anonymitySetCoverageNote } from './sectionCopy'

describe(anonymitySetCoverageNote.name, () => {
  it('reports how many deposits count towards the set', () => {
    expect(
      anonymitySetCoverageNote({ attributed: 1_234, total: 1_500 }, 30),
    ).toEqual(
      'Depositors were identified for 1,234 of 1,500 deposits (82%) during the last 30 complete UTC days. The remaining deposits are not counted.',
    )
  })

  it('stays silent for projects that report no coverage', () => {
    expect(anonymitySetCoverageNote(undefined, 30)).toEqual(undefined)
  })

  // A "0 of 0 deposits" sentence would read as failed attribution, not an idle window.
  it('stays silent when the window had no deposits', () => {
    expect(anonymitySetCoverageNote({ attributed: 0, total: 0 }, 30)).toEqual(
      undefined,
    )
  })
})
