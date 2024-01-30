import { expect } from 'earl'

import { layer2aWithDups } from '../test/stubs/layer2aWithDups'
import { getChainNames } from './chains'

describe(getChainNames.name, () => {
  it('correctly finds unique chain names for a single stub project with duplicates', () => {
    const chains = getChainNames({
      bridges: [],
      layer2s: [layer2aWithDups],
      layer3s: [],
    })

    chains.sort()
    expect(chains).toEqual(['ethereum', 'optimism'])
  })
})
