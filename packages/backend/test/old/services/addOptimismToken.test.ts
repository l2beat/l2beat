import { SimpleDate } from '@l2beat/common'
import { expect } from 'earljs'
import { BigNumber, utils } from 'ethers'

import { addOptimismToken } from '../../../src/old/services/addOptimismToken'
import { TVLAnalysis } from '../../../src/old/services/balances/model'

describe(addOptimismToken.name, () => {
  const OPTIMISM_TOKEN_ADDRESS = '0x4200000000000000000000000000000000000042'
  const AIRDROP_DATE = SimpleDate.fromString('2022-05-30')

  it('before airdrop', () => {
    const entry: TVLAnalysis = {
      date: AIRDROP_DATE.addDays(-2),
      blockNumber: 420042,
      prices: { token: {}, eth: BigNumber.from(1) },
      TVL: {
        usd: 42,
        eth: 42,
      },
      projects: {
        ['Optimism']: {
          TVL: {
            usd: 42,
            eth: 42,
          },
          tokens: {
            ['UNI']: {
              balance: 42,
              usd: 42,
            },
          },
        },
      },
    }
    const fetchedPrices = { token: {}, eth: BigNumber.from(1) }

    addOptimismToken(entry, AIRDROP_DATE.addDays(-2), fetchedPrices)

    expect(entry).toEqual({
      date: AIRDROP_DATE.addDays(-2),
      blockNumber: 420042,
      prices: { token: {}, eth: BigNumber.from(1) },
      TVL: {
        usd: 42,
        eth: 42,
      },
      projects: {
        ['Optimism']: {
          TVL: {
            usd: 42,
            eth: 42,
          },
          tokens: {
            ['UNI']: {
              balance: 42,
              usd: 42,
            },
          },
        },
      },
    })
  })

  it('after airdrop', () => {
    const entry: TVLAnalysis = {
      date: AIRDROP_DATE,
      blockNumber: 420042,
      prices: { token: {}, eth: BigNumber.from(1) },
      TVL: {
        usd: 42,
        eth: 42,
      },
      projects: {
        ['Optimism']: {
          TVL: {
            usd: 42,
            eth: 42,
          },
          tokens: {
            ['UNI']: {
              balance: 42,
              usd: 42,
            },
          },
        },
      },
    }

    const balance = 214_748_364
    const price = 2
    const priceEth = 2000

    const priceWei = utils.parseUnits(price.toFixed(18), 18)
    const priceEthWei = utils.parseUnits(priceEth.toFixed(18), 18)

    const fetchedPrices = {
      token: { [OPTIMISM_TOKEN_ADDRESS]: priceWei },
      eth: priceEthWei,
    }

    addOptimismToken(entry, AIRDROP_DATE.addDays(1), fetchedPrices)

    expect(entry).toEqual({
      date: AIRDROP_DATE,
      blockNumber: 420042,
      prices: { token: {}, eth: BigNumber.from(1) },
      TVL: {
        usd: 42 + balance * price,
        eth: 42 + (balance * price) / priceEth,
      },
      projects: {
        ['Optimism']: {
          TVL: {
            usd: 42 + balance * price,
            eth: 42 + (balance * price) / priceEth,
          },
          tokens: {
            ['UNI']: {
              balance: 42,
              usd: 42,
            },
            ['OP']: {
              balance,
              usd: balance * price,
            },
          },
        },
      },
    })
  })
})
