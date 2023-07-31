import {
  AssetId,
  ChainId,
  ProjectId,
  UnixTime,
  ValueType,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describe } from 'mocha'

import { AggregatedReportRecord } from '../../../peripherals/database/AggregatedReportRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import {
  getProjectTokensCharts,
  groupByProjectIdAndAsset,
  groupByProjectIdAndTimestamp,
} from './detailedTvl'

describe('detailedTvl', () => {
  describe(groupByProjectIdAndTimestamp.name, () => {
    it('groups reports by project id and timestamp', () => {
      const firstUnixTimestamp = UnixTime.now()
      const secondUnixTimestamp = UnixTime.now().add(-1, 'hours')

      const mockReports: AggregatedReportRecord[] = [
        {
          timestamp: firstUnixTimestamp,
          usdValue: 1n,
          ethValue: 1n,
          valueType: ValueType.CBV,
          projectId: ProjectId.ARBITRUM,
        },
        {
          timestamp: firstUnixTimestamp,
          usdValue: 2n,
          ethValue: 2n,
          valueType: ValueType.EBV,
          projectId: ProjectId.ARBITRUM,
        },
        {
          timestamp: secondUnixTimestamp,
          usdValue: 3n,
          ethValue: 3n,
          valueType: ValueType.TVL,
          projectId: ProjectId.ARBITRUM,
        },
        {
          timestamp: firstUnixTimestamp,
          usdValue: 1n,
          ethValue: 1n,
          valueType: ValueType.CBV,
          projectId: ProjectId.ETHEREUM,
        },
        {
          timestamp: firstUnixTimestamp,
          usdValue: 2n,
          ethValue: 2n,
          valueType: ValueType.EBV,
          projectId: ProjectId.ETHEREUM,
        },
        {
          timestamp: secondUnixTimestamp,
          usdValue: 3n,
          ethValue: 3n,
          valueType: ValueType.TVL,
          projectId: ProjectId.ETHEREUM,
        },
      ]

      const result = groupByProjectIdAndTimestamp(mockReports)

      expect(result).toEqual({
        [ProjectId.ARBITRUM.toString()]: {
          [firstUnixTimestamp.toString()]: [
            {
              timestamp: firstUnixTimestamp,
              usdValue: 1n,
              ethValue: 1n,
              valueType: ValueType.CBV,
              projectId: ProjectId.ARBITRUM,
            },
            {
              timestamp: firstUnixTimestamp,
              usdValue: 2n,
              ethValue: 2n,
              valueType: ValueType.EBV,
              projectId: ProjectId.ARBITRUM,
            },
          ],
          [secondUnixTimestamp.toString()]: [
            {
              timestamp: secondUnixTimestamp,
              usdValue: 3n,
              ethValue: 3n,
              valueType: ValueType.TVL,
              projectId: ProjectId.ARBITRUM,
            },
          ],
        },
        [ProjectId.ETHEREUM.toString()]: {
          [firstUnixTimestamp.toString()]: [
            {
              timestamp: firstUnixTimestamp,
              usdValue: 1n,
              ethValue: 1n,
              valueType: ValueType.CBV,
              projectId: ProjectId.ETHEREUM,
            },
            {
              timestamp: firstUnixTimestamp,
              usdValue: 2n,
              ethValue: 2n,
              valueType: ValueType.EBV,
              projectId: ProjectId.ETHEREUM,
            },
          ],
          [secondUnixTimestamp.toString()]: [
            {
              timestamp: secondUnixTimestamp,
              usdValue: 3n,
              ethValue: 3n,
              valueType: ValueType.TVL,
              projectId: ProjectId.ETHEREUM,
            },
          ],
        },
      })
    })
  })

  describe(groupByProjectIdAndAsset.name, () => {
    it('groups reports by project id and asset', () => {
      const timestamp = UnixTime.now()
      const mockReports: ReportRecord[] = [
        {
          timestamp,
          type: ValueType.CBV,
          chainId: ChainId.ARBITRUM,
          projectId: ProjectId.ARBITRUM,
          amount: 1n,
          usdValue: 1n,
          ethValue: 1n,
          asset: AssetId.USDC,
        },
        {
          timestamp,
          type: ValueType.NMV,
          chainId: ChainId.ARBITRUM,
          projectId: ProjectId.ARBITRUM,
          amount: 2n,
          usdValue: 2n,
          ethValue: 2n,
          asset: AssetId.USDC,
        },
        {
          timestamp,
          type: ValueType.EBV,
          chainId: ChainId.ARBITRUM,
          projectId: ProjectId.ARBITRUM,
          amount: 3n,
          usdValue: 3n,
          ethValue: 3n,
          asset: AssetId.ETH,
        },
        {
          timestamp,
          type: ValueType.EBV,
          chainId: ChainId.ETHEREUM,
          projectId: ProjectId.ETHEREUM,
          amount: 1n,
          usdValue: 1n,
          ethValue: 1n,
          asset: AssetId.USDC,
        },
        {
          timestamp,
          type: ValueType.CBV,
          chainId: ChainId.ETHEREUM,
          projectId: ProjectId.ETHEREUM,
          amount: 2n,
          usdValue: 2n,
          ethValue: 2n,
          asset: AssetId.USDC,
        },
        {
          timestamp,
          type: ValueType.NMV,
          chainId: ChainId.ETHEREUM,
          projectId: ProjectId.ETHEREUM,
          amount: 3n,
          usdValue: 3n,
          ethValue: 3n,
          asset: AssetId.ETH,
        },
      ]

      const result = groupByProjectIdAndAsset(mockReports)

      expect(result).toEqual({
        [ProjectId.ARBITRUM.toString()]: {
          [AssetId.USDC.toString()]: [
            {
              timestamp,
              type: ValueType.CBV,
              chainId: ChainId.ARBITRUM,
              projectId: ProjectId.ARBITRUM,
              amount: 1n,
              usdValue: 1n,
              ethValue: 1n,
              asset: AssetId.USDC,
            },
            {
              timestamp,
              type: ValueType.NMV,
              chainId: ChainId.ARBITRUM,
              projectId: ProjectId.ARBITRUM,
              amount: 2n,
              usdValue: 2n,
              ethValue: 2n,
              asset: AssetId.USDC,
            },
          ],
          [AssetId.ETH.toString()]: [
            {
              timestamp,
              type: ValueType.EBV,
              chainId: ChainId.ARBITRUM,
              projectId: ProjectId.ARBITRUM,
              amount: 3n,
              usdValue: 3n,
              ethValue: 3n,
              asset: AssetId.ETH,
            },
          ],
        },
        [ProjectId.ETHEREUM.toString()]: {
          [AssetId.USDC.toString()]: [
            {
              timestamp,
              type: ValueType.EBV,
              chainId: ChainId.ETHEREUM,
              projectId: ProjectId.ETHEREUM,
              amount: 1n,
              usdValue: 1n,
              ethValue: 1n,
              asset: AssetId.USDC,
            },
            {
              timestamp,
              type: ValueType.CBV,
              chainId: ChainId.ETHEREUM,
              projectId: ProjectId.ETHEREUM,
              amount: 2n,
              usdValue: 2n,
              ethValue: 2n,
              asset: AssetId.USDC,
            },
          ],
          [AssetId.ETH.toString()]: [
            {
              timestamp,
              type: ValueType.NMV,
              chainId: ChainId.ETHEREUM,
              projectId: ProjectId.ETHEREUM,
              amount: 3n,
              usdValue: 3n,
              ethValue: 3n,
              asset: AssetId.ETH,
            },
          ],
        },
      })
    })
  })

  describe(getProjectTokensCharts.name, () => {
    const timestamp = UnixTime.now()

    const mockReports: ReportRecord[] = [
      {
        timestamp,
        type: ValueType.CBV,
        chainId: ChainId.ARBITRUM,
        projectId: ProjectId.ARBITRUM,
        amount: 1n,
        usdValue: 1n,
        ethValue: 1n,
        asset: AssetId.USDC,
      },
      {
        timestamp,
        type: ValueType.NMV,
        chainId: ChainId.ARBITRUM,
        projectId: ProjectId.ARBITRUM,
        amount: 2n,
        usdValue: 2n,
        ethValue: 2n,
        asset: AssetId.USDC,
      },
      {
        timestamp,
        type: ValueType.EBV,
        chainId: ChainId.ARBITRUM,
        projectId: ProjectId.ARBITRUM,
        amount: 3n,
        usdValue: 3n,
        ethValue: 3n,
        asset: AssetId.ETH,
      },
      {
        timestamp,
        type: ValueType.EBV,
        chainId: ChainId.ETHEREUM,
        projectId: ProjectId.ETHEREUM,
        amount: 10n,
        usdValue: 10n,
        ethValue: 10n,
        asset: AssetId.USDC,
      },
      {
        timestamp,
        type: ValueType.CBV,
        chainId: ChainId.ETHEREUM,
        projectId: ProjectId.ETHEREUM,
        amount: 20n,
        usdValue: 20n,
        ethValue: 20n,
        asset: AssetId.USDC,
      },
      {
        timestamp,
        type: ValueType.NMV,
        chainId: ChainId.ETHEREUM,
        projectId: ProjectId.ETHEREUM,
        amount: 30n,
        usdValue: 30n,
        ethValue: 30n,
        asset: AssetId.ETH,
      },
    ]
    it('deduplicates assets and reduces overall value', () => {
      const groupedReports = groupByProjectIdAndAsset(mockReports)

      const arbitrumResult = getProjectTokensCharts(
        groupedReports,
        ProjectId.ARBITRUM,
      )

      const ethereumResult = getProjectTokensCharts(
        groupedReports,
        ProjectId.ETHEREUM,
      )

      expect(arbitrumResult).toEqual([
        {
          assetId: AssetId.USDC,
          tvl: 0.03, // 1n + 2n
        },
        {
          assetId: AssetId.ETH,
          tvl: 0.03, // 3n
        },
      ])

      expect(ethereumResult).toEqual([
        {
          assetId: AssetId.USDC,
          tvl: 0.3, // 10n + 20n
        },
        {
          assetId: AssetId.ETH,
          tvl: 0.3, // 30n
        },
      ])
    })
    it('return empty array if no project assets were found', () => {
      const groupedReports = groupByProjectIdAndAsset(mockReports)

      const optimismResult = getProjectTokensCharts(
        groupedReports,
        ProjectId.OPTIMISM,
      )

      expect(optimismResult).toEqual([])
    })
  })
})
