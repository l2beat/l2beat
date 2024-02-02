import { expect } from 'earl'

import { getUpgradesAndGovernanceImage } from './getUpgradesAndGovernanceImage'

describe(getUpgradesAndGovernanceImage.name, () => {
  it('returns true for optimism', () => {
    expect(getUpgradesAndGovernanceImage('optimism')).toEqual(
      '/images/upgrades-and-governance/optimism.png',
    )
  })
  it('returns false for dupa', () => {
    expect(getUpgradesAndGovernanceImage('dupa')).toEqual(undefined)
  })
})
