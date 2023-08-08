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
  groupByProjectIdAndAssetType,
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

  describe(groupByProjectIdAndAssetType.name, () => {
    it('groups reports by project id and asset type', () => {
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

      const result = groupByProjectIdAndAssetType(mockReports)

      expect(result).toEqual({
        [ProjectId.ARBITRUM.toString()]: {
          [ValueType.CBV.toString()]: [
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
          ],
          [ValueType.EBV.toString()]: [
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
          [ValueType.NMV.toString()]: [
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
        },
        [ProjectId.ETHEREUM.toString()]: {
          [ValueType.EBV.toString()]: [
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
          ],
          [ValueType.CBV.toString()]: [
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
          [ValueType.NMV.toString()]: [
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
        amount: 100n,
        usdValue: 100n,
        ethValue: 100n,
        asset: AssetId.ETH,
      },
      {
        timestamp,
        type: ValueType.CBV,
        chainId: ChainId.ARBITRUM,
        projectId: ProjectId.ARBITRUM,
        amount: 200n,
        usdValue: 200n,
        ethValue: 200n,
        asset: AssetId.USDC,
      },
      {
        timestamp,
        type: ValueType.EBV,
        chainId: ChainId.ARBITRUM,
        projectId: ProjectId.ARBITRUM,
        amount: 300n,
        usdValue: 300n,
        ethValue: 300n,
        asset: AssetId.ETH,
      },
      {
        timestamp,
        type: ValueType.EBV,
        chainId: ChainId.ETHEREUM,
        projectId: ProjectId.ETHEREUM,
        amount: 1000n,
        usdValue: 1000n,
        ethValue: 1000n,
        asset: AssetId.USDC,
      },
      {
        timestamp,
        type: ValueType.CBV,
        chainId: ChainId.ETHEREUM,
        projectId: ProjectId.ETHEREUM,
        amount: 2000n,
        usdValue: 2000n,
        ethValue: 2000n,
        asset: AssetId.OP,
      },
      {
        timestamp,
        type: ValueType.NMV,
        chainId: ChainId.ETHEREUM,
        projectId: ProjectId.ETHEREUM,
        amount: 3000n,
        usdValue: 3000n,
        ethValue: 3000n,
        asset: AssetId.ETH,
      },
    ]
    it('returns project tokens grouped by asset type and sorted in descending order', () => {
      const groupedReports = groupByProjectIdAndAssetType(mockReports)

      const arbitrumResult = getProjectTokensCharts(
        groupedReports,
        ProjectId.ARBITRUM,
      )

      const ethereumResult = getProjectTokensCharts(
        groupedReports,
        ProjectId.ETHEREUM,
      )

      expect(arbitrumResult).toEqual({
        CBV: [
          {
            valueType: ValueType.CBV,
            assetId: AssetId.USDC,
            chainId: ChainId.ARBITRUM,
            usdValue: 2,
          },
          {
            valueType: ValueType.CBV,
            assetId: AssetId.ETH,
            chainId: ChainId.ARBITRUM,
            usdValue: 1,
          },
        ],
        EBV: [
          {
            valueType: ValueType.EBV,
            assetId: AssetId.ETH,
            chainId: ChainId.ARBITRUM,
            usdValue: 3,
          },
        ],
        NMV: [],
      })

      expect(ethereumResult).toEqual({
        CBV: [
          {
            valueType: ValueType.CBV,
            assetId: AssetId.OP,
            chainId: ChainId.ETHEREUM,
            usdValue: 20,
          },
        ],
        EBV: [
          {
            valueType: ValueType.EBV,
            assetId: AssetId.USDC,
            chainId: ChainId.ETHEREUM,
            usdValue: 10,
          },
        ],
        NMV: [
          {
            valueType: ValueType.NMV,
            assetId: AssetId.ETH,
            chainId: ChainId.ETHEREUM,
            usdValue: 30,
          },
        ],
      })
    })

    it('returns empty array if no project`s assets were found', () => {
      const groupedReports = groupByProjectIdAndAssetType(mockReports)

      const optimismResult = getProjectTokensCharts(
        groupedReports,
        ProjectId.OPTIMISM,
      )

      expect(optimismResult).toEqual({
        CBV: [],
        EBV: [],
        NMV: [],
      })
    })
  })
})
