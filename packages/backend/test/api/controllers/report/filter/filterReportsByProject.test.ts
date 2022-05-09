import { AssetId, CoingeckoId, EthereumAddress, UnixTime } from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { expect } from 'earljs'

import { filterReportsByProjects } from '../../../../../src/api/controllers/report/filter/filterReportsByProjects'
import { ProjectInfo } from '../../../../../src/model'

describe(filterReportsByProjects.name, () => {
  const START = 123456n
  const ARBITRUM = EthereumAddress.random()
  const OPTIMISM = EthereumAddress.random()

  const mockReport = (
    blockNumber: bigint,
    bridge: EthereumAddress,
    asset: AssetId
  ) => {
    return {
      blockNumber: blockNumber,
      timestamp: new UnixTime(0),
      bridge: bridge,
      asset: asset,
      usdTVL: 0n,
      ethTVL: 0n,
      balance: 0n,
    }
  }

  const mockToken = (assetId: AssetId, sinceBlock: number): TokenInfo => {
    return {
      id: assetId,
      name: '',
      coingeckoId: CoingeckoId('-'),
      address: EthereumAddress.random(),
      symbol: '',
      decimals: 18,
      sinceBlock: sinceBlock,
      category: 'other',
    }
  }

  const PROJECTS: ProjectInfo[] = [
    {
      name: 'Arbitrum',
      bridges: [
        {
          address: ARBITRUM.toString(),
          sinceBlock: 0,
          tokens: [
            mockToken(AssetId.DAI, 0),
            mockToken(AssetId.WETH, Number(START + 1000n)),
          ],
        },
      ],
    },
    {
      name: 'Optimism',
      bridges: [
        {
          address: OPTIMISM.toString(),
          sinceBlock: Number(START + 1000n),
          tokens: [],
        },
      ],
    },
  ]

  it('bridge not in projects', () => {
    const reports = [
      mockReport(START, ARBITRUM, AssetId.DAI),
      mockReport(START, EthereumAddress.random(), AssetId.DAI),
    ]

    const result = filterReportsByProjects(reports, PROJECTS)

    expect(result).toEqual([mockReport(START, ARBITRUM, AssetId.DAI)])
  })

  it('token not in bridge', () => {
    const reports = [
      mockReport(START, ARBITRUM, AssetId.DAI),
      mockReport(START, ARBITRUM, AssetId('non-existing')),
    ]

    const result = filterReportsByProjects(reports, PROJECTS)

    expect(result).toEqual([mockReport(START, ARBITRUM, AssetId.DAI)])
  })

  it('bridge.sinceBlock > report.sinceBlock', () => {
    const reports = [
      mockReport(START, ARBITRUM, AssetId.DAI),
      mockReport(START, OPTIMISM, AssetId.DAI),
    ]

    const result = filterReportsByProjects(reports, PROJECTS)

    expect(result).toEqual([mockReport(START, ARBITRUM, AssetId.DAI)])
  })

  it('token.sinceBlock > report.sinceBlock', () => {
    const reports = [
      mockReport(START, ARBITRUM, AssetId.DAI),
      mockReport(START, ARBITRUM, AssetId.WETH),
    ]

    const result = filterReportsByProjects(reports, PROJECTS)

    expect(result).toEqual([mockReport(START, ARBITRUM, AssetId.DAI)])
  })
})
