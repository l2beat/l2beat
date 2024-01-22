import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { chains } from './index'

describe('chains', () => {
  it('every devId is lowercase a-z0-9 <20 characters', () => {
    for (const chain of chains) {
      expect(chain.devId).toMatchRegex(/^[a-z0-9]{1,20}$/)
    }
  })

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

  describe('multicall contracts are sorted by sinceBlock', () => {
    for (const chain of chains) {
      const contracts = chain.multicallContracts?.map((x) => x.sinceBlock)
      if (!contracts || contracts.length === 0) {
        continue
      }
      it(chain.devId, () => {
        expect(contracts).toEqual(contracts.slice().sort((a, b) => b - a))
      })
    }
  })
})
