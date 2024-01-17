import { EthereumAddress } from '@l2beat/shared-pure'
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

  describe('every multicall3 contract has the same address', () => {
    const address = EthereumAddress(
      '0xcA11bde05977b3631167028862bE2a173976CA11',
    )

    const contracts = chains
      .flatMap(
        (x) => x.multicallContracts?.map((y) => [x.devId, y] as const) ?? [],
      )
      .filter(([_, y]) => y.version === '3')

    for (const [devId, contract] of contracts) {
      it(`multicall3 on ${devId}`, () => {
        expect(contract.address).toEqual(address)
      })
    }
  })
})
