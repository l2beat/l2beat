import { expect } from 'earl'
import { getDaSolutionHref } from './getScalingDaSolutions'

describe(getDaSolutionHref.name, () => {
  it('links scaling DA layers to their scaling project page', () => {
    expect(
      getDaSolutionHref({
        layerSlug: 'robinhood',
        bridgeSlug: 'ethereum',
        isScalingProject: true,
      }),
    ).toEqual('/scaling/projects/robinhood')
  })

  it('links catalog DA layers to their bridge page', () => {
    expect(
      getDaSolutionHref({
        layerSlug: 'celestia',
        bridgeSlug: 'blobstream',
        isScalingProject: false,
      }),
    ).toEqual('/data-availability/projects/celestia/blobstream')
  })
})
