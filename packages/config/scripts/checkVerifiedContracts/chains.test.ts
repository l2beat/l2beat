import { expect } from 'earl'

import { layer2aWithDups } from '../../src/test/stubs/layer2aWithDups'
import { getChainDevIds } from './chains'

describe(getChainDevIds.name, () => {
  it('correctly finds unique devIds for a single stub project with duplicates', () => {
    const devIds = getChainDevIds([layer2aWithDups])
    devIds.sort()
    expect(devIds).toEqual(['ethereum', 'optimism'])
  })
})
