import { expect } from 'earl'

import { layer2s } from '../layer2s'
import { layer3s } from './index'

describe('layer3s', () => {
  it('every layer3 has a valid host chain', () => {
    for (const layer3 of layer3s) {
      expect(layer3.hostChain).not.toBeNullish()
      const hostChain = layer2s.find((x) => x.id === layer3.hostChain)
      expect(hostChain).not.toBeNullish()
    }
  })
})
