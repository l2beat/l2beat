import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { expect } from 'earljs'

import { filterReportsByProjects } from '../../../../../src/api/controllers/report/filter/filterReportsByProjects'
import { ProjectInfo } from '../../../../../src/model'

describe(filterReportsByProjects.name, () => {
  const SINCE_0 = new UnixTime(0)
  const TODAY = UnixTime.now()
  const LATER = TODAY.add(1, 'hours')
  const ARBITRUM = ProjectId('arbitrum')
  const OPTIMISM = ProjectId('optimism')

  const ARBITRUM_ADDRESS = EthereumAddress.random()
  const OPTIMISM_ADDRESS = EthereumAddress.random()

  const mockReport = (projectId: ProjectId, asset: AssetId, offset: number) => {
    return {
      timestamp: TODAY.add(offset, 'hours'),
      projectId,
      asset,
      balanceUsd: 0n,
      balanceEth: 0n,
      balance: 0n,
    }
  }

  const mockToken = (assetId: AssetId, sinceTimestamp: UnixTime): TokenInfo => {
    return {
      id: assetId,
      name: '',
      coingeckoId: CoingeckoId('-'),
      address: EthereumAddress.random(),
      symbol: '',
      decimals: 18,
      sinceTimestamp,
      category: 'other',
    }
  }

  const PROJECTS: ProjectInfo[] = [
    {
      name: 'Arbitrum',
      projectId: ARBITRUM,
      bridges: [
        {
          address: ARBITRUM_ADDRESS,
          sinceTimestamp: SINCE_0,
          tokens: [
            mockToken(AssetId.DAI, SINCE_0),
            mockToken(AssetId.WETH, LATER),
          ],
        },
      ],
    },
    {
      name: 'Optimism',
      projectId: OPTIMISM,
      bridges: [
        {
          address: OPTIMISM_ADDRESS,
          sinceTimestamp: LATER,
          tokens: [],
        },
      ],
    },
  ]

  it('bridge not in projects', () => {
    const reports = [
      mockReport(ARBITRUM, AssetId.DAI, 0),
      mockReport(ProjectId('fake-project'), AssetId.DAI, 0),
    ]

    const result = filterReportsByProjects(reports, PROJECTS)

    expect(result).toEqual([mockReport(ARBITRUM, AssetId.DAI, 0)])
  })

  it('token not in bridge', () => {
    const reports = [
      mockReport(ARBITRUM, AssetId.DAI, 0),
      mockReport(ARBITRUM, AssetId('non-existing'), 0),
    ]

    const result = filterReportsByProjects(reports, PROJECTS)

    expect(result).toEqual([mockReport(ARBITRUM, AssetId.DAI, 0)])
  })
})
