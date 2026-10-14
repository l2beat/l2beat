import type { ProjectCrops } from '@l2beat/config'
import { expect } from 'earl'
import { getGardenListing, resolveProjectCrops } from './resolveCrops'

// crops-api tests its copy of these rules at length; this checks the site's
// copy caps Security the same way.
describe('Security capped by ossification', () => {
  const crops: ProjectCrops = {
    censorshipResistance: { sentiment: 'good' },
    openSource: { sentiment: 'good' },
    privacy: { sentiment: 'good' },
    security: { sentiment: 'good' },
  }

  it('keeps the written rating from 80 up', () => {
    const resolved = resolveProjectCrops(crops, {
      score: 80,
      isUnverified: false,
    })
    expect(resolved.security.sentiment).toEqual('good')
    expect(getGardenListing(resolved, true)).toEqual('listed')
  })

  it('caps at warning below 80 and says why', () => {
    const resolved = resolveProjectCrops(crops, {
      score: 79,
      isUnverified: false,
    })
    expect(resolved.security).toHaveSubset({
      sentiment: 'warning',
      missing: [
        'Ossification score below 80: critical contracts changed within about the last year.',
      ],
    })
  })

  it('rates it bad below 50, which takes the project out', () => {
    const resolved = resolveProjectCrops(crops, {
      score: 49,
      isUnverified: false,
    })
    expect(resolved.security.sentiment).toEqual('bad')
    expect(getGardenListing(resolved, true)).toEqual('ratedBad')
  })
})
