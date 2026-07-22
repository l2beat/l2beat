import { expect } from 'earl'
import { getDaSolutionHref } from './getLayer2sDaSolutions'

describe(getDaSolutionHref.name, () => {
  it('links scaling DA layers to their scaling project page', () => {
    expect(
      getDaSolutionHref({
        layerSlug: 'robinhood',
        bridgeSlug: 'ethereum',
        isLayer2sProject: true,
      }),
    ).toEqual('/layer2s/projects/robinhood')
  })

  it('links catalog DA layers to their bridge page', () => {
    expect(
      getDaSolutionHref({
        layerSlug: 'celestia',
        bridgeSlug: 'blobstream',
        isLayer2sProject: false,
      }),
    ).toEqual('/data-availability/projects/celestia/blobstream')
  })
})
