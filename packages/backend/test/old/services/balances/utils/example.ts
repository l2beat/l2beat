import { getTokenBySymbol, TokenInfo } from '@l2beat/config'
import { utils } from 'ethers'

import { ProjectInfo } from '../../../../../src/model'
import { FetchedBalances } from '../../../../../src/old/services/balances/model'
import { PriceSnapshot } from '../../../../../src/old/services/prices/model'

export function makeExampleProjects() {
  const eth = getTokenBySymbol('ETH')
  const dai = getTokenBySymbol('DAI')
  const usdc = getTokenBySymbol('USDC')
  const usdt = getTokenBySymbol('USDT')

  const holderA = '0x' + '1234'.repeat(10)
  const holderB = '0x' + 'abcd'.repeat(10)
  const holderC = '0x' + '12ab'.repeat(10)

  const bridge = (address: string, tokens: TokenInfo[]) => ({
    address,
    sinceBlock: 1,
    tokens,
  })

  const projects: ProjectInfo[] = [
    {
      name: 'foo',
      bridges: [bridge(holderA, [eth, dai]), bridge(holderB, [dai, usdc])],
    },
    {
      name: 'bar',
      bridges: [bridge(holderC, [eth, usdc, usdt])],
    },
  ]

  const balances: FetchedBalances = {
    token: {
      [dai.address!]: {
        [holderA]: utils.parseUnits('123', dai.decimals),
        [holderB]: utils.parseUnits('45', dai.decimals),
      },
      [usdc.address!]: {
        [holderB]: utils.parseUnits('20', usdc.decimals),
        [holderC]: utils.parseUnits('5', usdc.decimals),
      },
      [usdt.address!]: {
        [holderC]: utils.parseUnits('10', usdt.decimals),
      },
    },
    eth: {
      [holderA]: utils.parseUnits('3', eth.decimals),
      [holderC]: utils.parseUnits('4', eth.decimals),
    },
  }

  const prices: PriceSnapshot = {
    token: {
      [dai.address!]: utils.parseUnits('1', 18),
      [usdc.address!]: utils.parseUnits('1.01', 18 * 2 - 6),
      [usdt.address!]: utils.parseUnits('0.99', 18 * 2 - 6),
    },
    eth: utils.parseUnits('4000', 18),
  }

  return {
    eth,
    dai,
    usdc,
    usdt,
    holderA,
    holderB,
    holderC,
    projects,
    balances,
    prices,
  }
}
