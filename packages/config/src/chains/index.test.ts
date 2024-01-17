import { expect } from 'earl'

import { chains } from './index'

describe('chains', () => {
  it('every devId is unique', () => {
    const encountered = new Set()
    for (const chain of chains) {
      expect(encountered.has(chain.devId)).toEqual(false)
      encountered.add(chain.devId)
    }
  })

  it('every chainId is unique', () => {
    const encountered = new Set()
    for (const chain of chains) {
      expect(encountered.has(chain.chainId)).toEqual(false)
      encountered.add(chain.chainId)
    }
  })
})
