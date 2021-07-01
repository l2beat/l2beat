import { BigNumber } from 'ethers'
import { TEN_TO_18 } from '../../../constants'
import { FetchedPrices } from '../model'
import { asNumber } from './asNumber'
import { ProjectStats } from './getProjectStats'

export function getAggregateTVL(
  projectStats: ProjectStats[],
  prices: FetchedPrices
) {
  const totalUsdBalance = projectStats
    .map((x) => x.usdBalance)
    .reduce((a, b) => a.add(b), BigNumber.from(0))
  const totalEthBalance = prices.eth.eq(0)
    ? BigNumber.from(0)
    : totalUsdBalance.mul(TEN_TO_18).div(prices.eth)
  const TVL = {
    usd: asNumber(totalUsdBalance, 18, 2),
    eth: asNumber(totalEthBalance, 18, 6),
  }
  return TVL
}
