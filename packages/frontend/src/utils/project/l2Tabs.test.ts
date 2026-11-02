import { expect } from 'earl'
import { getL2ListingHref } from './l2Tabs'

describe(getL2ListingHref.name, () => {
  it('opens the summary on the tab of the project category', () => {
    expect(
      getL2ListingHref({ category: 'Validium', isArchived: false }),
    ).toEqual('/layer2s/summary?tab=validiumsAndOptimiums')
    expect(getL2ListingHref({ category: 'Other', isArchived: false })).toEqual(
      '/layer2s/summary?tab=others',
    )
  })

  it('keeps the canonical summary URL for rollups, its default tab', () => {
    expect(
      getL2ListingHref({ category: 'ZK Rollup', isArchived: false }),
    ).toEqual('/layer2s/summary')
  })

  it('sends archived projects to the archived page', () => {
    expect(
      getL2ListingHref({ category: 'Optimium', isArchived: true }),
    ).toEqual('/layer2s/archived')
  })
})
