import { expect } from 'earl'

import { layer2aWithDups } from '../../src/test/stubs/layer2aWithDups'
import { getChainNames } from './chains'

describe(getChainNames.name, () => {
  it('correctly finds unique chain names for a single stub project with duplicates', () => {
    const chains = getChainNames([layer2aWithDups])
    chains.sort()
    expect(chains).toEqual(['ethereum', 'optimism'])
  })
})
