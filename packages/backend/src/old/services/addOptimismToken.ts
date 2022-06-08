import { divOrZero, SimpleDate } from '@l2beat/common'
import { BigNumber } from 'ethers'

import { TEN_TO_18 } from '../constants'
import { TVLAnalysis } from './balances/model'
import { asNumber } from './common/asNumber'
import { PriceSnapshot } from './prices/model'

const OPTIMISM_TOKEN_ADDRESS = '0x4200000000000000000000000000000000000042'
export function addOptimismToken(
  entry: TVLAnalysis,
  date: SimpleDate,
  fetchedPrices: PriceSnapshot
) {
  if (!date.isAfter(SimpleDate.fromString('2022-05-30'))) {
    return
  }
  const price = fetchedPrices.token[OPTIMISM_TOKEN_ADDRESS]
  if (!price) {
    return
  }

  // This is the circulating supply of OP as given by Coingecko.
  // The value is obtained by looking at how many tokens have been designated
  // to be distributed in the Optimism's airdrop.
  // Our policy is to keep this value in sync with Coingecko.
  // https://www.coingecko.com/en/coins/optimism
  // https://optimistic.etherscan.io/token/0x4200000000000000000000000000000000000042?a=0x2a82ae142b2e62cb7d10b55e323acb1cab663a26
  const balance = 214_748_364

  const balanceWei = BigNumber.from(balance).mul(TEN_TO_18)
  const usdWei = balanceWei.mul(price).div(TEN_TO_18)
  const ethWei = divOrZero(usdWei.mul(TEN_TO_18), fetchedPrices.eth)
  const usd = asNumber(usdWei, 18, 2)
  const eth = asNumber(ethWei, 18, 6)

  entry.projects['Optimism'].tokens['OP'] = {
    balance,
    usd,
  }
  entry.projects['Optimism'].TVL.usd += usd
  entry.projects['Optimism'].TVL.eth += eth
  entry.TVL.usd += usd
  entry.TVL.eth += eth
}
