import { getTokenBySymbol, TokenInfo } from '@l2beat/config'
import { expect } from 'earljs'

import { ProjectInfo } from '../../../../../src/model'
import { getHolders } from '../../../../../src/old/services/balances/utils'

describe(getHolders.name, () => {
  it('returns the various holders', () => {
    const eth = getTokenBySymbol('ETH')
    const dai = getTokenBySymbol('DAI')
    const usdc = getTokenBySymbol('USDC')
    const usdt = getTokenBySymbol('USDT')
    const fake = { address: '123', sinceBlock: 13_000_000 } as TokenInfo

    const holderA = '0x' + '1234'.repeat(10)
    const holderB = '0x' + 'abcd'.repeat(10)
    const holderC = '0x' + '12ab'.repeat(10)
    const holderD = '0x' + 'a1b2'.repeat(10)

    const bridge = (address: string, tokens: TokenInfo[], sinceBlock = 0) => ({
      address,
      sinceBlock,
      tokens,
    })

    const projects: ProjectInfo[] = [
      {
        name: 'foo',
        bridges: [bridge(holderA, [eth, dai]), bridge(holderB, [dai, usdc])],
      },
      {
        name: 'bar',
        bridges: [
          bridge(holderC, [usdc, dai, usdt]),
          bridge(holderD, [eth, fake], 12_100_000),
        ],
      },
    ]

    const result = getHolders(projects, 12_000_000)
    const expected: ReturnType<typeof getHolders> = {
      tokenHolders: {
        [dai.address!]: [holderA, holderB, holderC],
        [usdc.address!]: [holderB, holderC],
        [usdt.address!]: [holderC],
      },
      ethHolders: [holderA],
    }
    expect(result).toEqual(expected)
  })
})
