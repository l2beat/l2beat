import { expect } from 'earl'

import { EthereumAddress } from '@l2beat/shared-pure'
import { chains } from './index'

describe('chains', () => {
  it('every name is lowercase a-z0-9 <20 characters', () => {
    for (const chain of chains) {
      expect(chain.name).toMatchRegex(/^[a-z0-9]{1,20}$/)
    }
  })

  it('every name is unique', () => {
    const encountered = new Set()
    for (const chain of chains) {
      expect(encountered.has(chain.name)).toEqual(false)
      encountered.add(chain.name)
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
      .filter(
        (c) => c.name !== 'zksync2' && c.name !== 'kinto' && c.name !== 'degen',
      ) // we are omitting zksync2, degen and kinto as they use different addresses
      .flatMap(
        (x) => x.multicallContracts?.map((y) => [x.name, y] as const) ?? [],
      )
      .filter(([_, y]) => y.version === '3')

    for (const [chain, contract] of contracts) {
      it(`multicall3 on ${chain}`, () => {
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
      it(chain.name, () => {
        expect(contracts).toEqual(contracts.slice().sort((a, b) => b - a))
      })
    }
  })
})
