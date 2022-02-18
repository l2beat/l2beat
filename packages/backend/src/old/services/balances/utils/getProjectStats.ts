import { divOrZero } from '@l2beat/common'
import { BigNumber } from 'ethers'

import { ProjectInfo } from '../../../../model'
import { TEN_TO_18 } from '../../../constants'
import { PriceSnapshot } from '../../prices/model'
import { FetchedBalances, TokenTVL } from '../model'
import { getTokenStats } from './getTokenStats'
import { getTokenTVL } from './getTokenTVL'

export interface ProjectStats {
  project: ProjectInfo
  tokenTVL: Record<string, TokenTVL>
  usdBalance: BigNumber
  ethBalance: BigNumber
}

export function getProjectStats(
  projects: ProjectInfo[],
  balances: FetchedBalances,
  prices: PriceSnapshot
): ProjectStats[] {
  return projects.map((project) => {
    const tokenStats = getTokenStats(project, balances, prices)
    const tokenTVL = getTokenTVL(tokenStats)
    const projectUsdBalance = tokenStats
      .map((x) => x.value)
      .reduce((a, b) => a.add(b), BigNumber.from(0))
    const projectEthBalance = divOrZero(
      projectUsdBalance.mul(TEN_TO_18),
      prices.eth
    )
    return {
      project,
      tokenTVL,
      usdBalance: projectUsdBalance,
      ethBalance: projectEthBalance,
    }
  })
}
