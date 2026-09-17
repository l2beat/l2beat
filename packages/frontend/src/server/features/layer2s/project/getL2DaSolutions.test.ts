import { describe, expect, it } from 'vitest'
import { getDaSolutionHref } from './getL2DaSolutions'

describe(getDaSolutionHref.name, () => {
  it('links scaling DA layers to their scaling project page', () => {
    expect(
      getDaSolutionHref({
        layerSlug: 'robinhood',
        bridgeSlug: 'ethereum',
        isL2Project: true,
      }),
    ).toBe('/layer2s/projects/robinhood')
  })

  it('links catalog DA layers to their bridge page', () => {
    expect(
      getDaSolutionHref({
        layerSlug: 'celestia',
        bridgeSlug: 'blobstream',
        isL2Project: false,
      }),
    ).toBe('/data-availability/projects/celestia/blobstream')
  })
})
