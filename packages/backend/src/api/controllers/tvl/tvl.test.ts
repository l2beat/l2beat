import { AssetId, ChainId, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describe } from 'mocha'

import { AggregatedReportRecord } from '../../../peripherals/database/AggregatedReportRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import {
  getProjectTokensCharts,
  groupByProjectIdAndAssetType,
  groupByProjectIdAndTimestamp,
} from './tvl'

describe('tvl', () => {
  describe(groupByProjectIdAndTimestamp.name, () => {
    it('groups reports by project id and timestamp', () => {
      const firstUnixTimestamp = UnixTime.now()
      const secondUnixTimestamp = UnixTime.now().add(-1, 'hours')

      const mockReports: AggregatedReportRecord[] = [
        {
          timestamp: firstUnixTimestamp,
          usdValue: 1n,
          ethValue: 1n,
          reportType: 'CBV',
          projectId: ProjectId.ARBITRUM,
        },
        {
          timestamp: firstUnixTimestamp,
          usdValue: 2n,
          ethValue: 2n,
          reportType: 'EBV',
          projectId: ProjectId.ARBITRUM,
        },
        {
          timestamp: secondUnixTimestamp,
          usdValue: 3n,
          ethValue: 3n,
          reportType: 'TVL',
          projectId: ProjectId.ARBITRUM,
        },
        {
          timestamp: firstUnixTimestamp,
          usdValue: 1n,
          ethValue: 1n,
          reportType: 'CBV',
          projectId: ProjectId.ETHEREUM,
        },
        {
          timestamp: firstUnixTimestamp,
          usdValue: 2n,
          ethValue: 2n,
          reportType: 'EBV',
          projectId: ProjectId.ETHEREUM,
        },
        {
          timestamp: secondUnixTimestamp,
          usdValue: 3n,
          ethValue: 3n,
          reportType: 'TVL',
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
              reportType: 'CBV',
              projectId: ProjectId.ARBITRUM,
            },
            {
              timestamp: firstUnixTimestamp,
              usdValue: 2n,
              ethValue: 2n,
              reportType: 'EBV',
              projectId: ProjectId.ARBITRUM,
            },
          ],
          [secondUnixTimestamp.toString()]: [
            {
              timestamp: secondUnixTimestamp,
              usdValue: 3n,
              ethValue: 3n,
              reportType: 'TVL',
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
              reportType: 'CBV',
              projectId: ProjectId.ETHEREUM,
            },
            {
              timestamp: firstUnixTimestamp,
              usdValue: 2n,
              ethValue: 2n,
              reportType: 'EBV',
              projectId: ProjectId.ETHEREUM,
            },
          ],
          [secondUnixTimestamp.toString()]: [
            {
              timestamp: secondUnixTimestamp,
              usdValue: 3n,
              ethValue: 3n,
              reportType: 'TVL',
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
          reportType: 'CBV',
          chainId: ChainId.ARBITRUM,
          projectId: ProjectId.ARBITRUM,
          amount: 1n,
          usdValue: 1n,
          ethValue: 1n,
          asset: AssetId.USDC,
        },
        {
          timestamp,
          reportType: 'NMV',
          chainId: ChainId.ARBITRUM,
          projectId: ProjectId.ARBITRUM,
          amount: 2n,
          usdValue: 2n,
          ethValue: 2n,
          asset: AssetId.USDC,
        },
        {
          timestamp,
          reportType: 'EBV',
          chainId: ChainId.ARBITRUM,
          projectId: ProjectId.ARBITRUM,
          amount: 3n,
          usdValue: 3n,
          ethValue: 3n,
          asset: AssetId.ETH,
        },
        {
          timestamp,
          reportType: 'EBV',
          chainId: ChainId.ETHEREUM,
          projectId: ProjectId.ETHEREUM,
          amount: 1n,
          usdValue: 1n,
          ethValue: 1n,
          asset: AssetId.USDC,
        },
        {
          timestamp,
          reportType: 'CBV',
          chainId: ChainId.ETHEREUM,
          projectId: ProjectId.ETHEREUM,
          amount: 2n,
          usdValue: 2n,
          ethValue: 2n,
          asset: AssetId.USDC,
        },
        {
          timestamp,
          reportType: 'NMV',
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
          CBV: [
            {
              timestamp,
              reportType: 'CBV',
              chainId: ChainId.ARBITRUM,
              projectId: ProjectId.ARBITRUM,
              amount: 1n,
              usdValue: 1n,
              ethValue: 1n,
              asset: AssetId.USDC,
            },
          ],
          EBV: [
            {
              timestamp,
              reportType: 'EBV',
              chainId: ChainId.ARBITRUM,
              projectId: ProjectId.ARBITRUM,
              amount: 3n,
              usdValue: 3n,
              ethValue: 3n,
              asset: AssetId.ETH,
            },
          ],
          NMV: [
            {
              timestamp,
              reportType: 'NMV',
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
          EBV: [
            {
              timestamp,
              reportType: 'EBV',
              chainId: ChainId.ETHEREUM,
              projectId: ProjectId.ETHEREUM,
              amount: 1n,
              usdValue: 1n,
              ethValue: 1n,
              asset: AssetId.USDC,
            },
          ],
          CBV: [
            {
              timestamp,
              reportType: 'CBV',
              chainId: ChainId.ETHEREUM,
              projectId: ProjectId.ETHEREUM,
              amount: 2n,
              usdValue: 2n,
              ethValue: 2n,
              asset: AssetId.USDC,
            },
          ],
          NMV: [
            {
              timestamp,
              reportType: 'NMV',
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
        reportType: 'CBV',
        chainId: ChainId.ARBITRUM,
        projectId: ProjectId.ARBITRUM,
        amount: 100n,
        usdValue: 100n,
        ethValue: 100n,
        asset: AssetId.ETH,
      },
      {
        timestamp,
        reportType: 'CBV',
        chainId: ChainId.ARBITRUM,
        projectId: ProjectId.ARBITRUM,
        amount: 200n,
        usdValue: 200n,
        ethValue: 200n,
        asset: AssetId.USDC,
      },
      {
        timestamp,
        reportType: 'EBV',
        chainId: ChainId.ARBITRUM,
        projectId: ProjectId.ARBITRUM,
        amount: 300n,
        usdValue: 300n,
        ethValue: 300n,
        asset: AssetId.ETH,
      },
      {
        timestamp,
        reportType: 'EBV',
        chainId: ChainId.ETHEREUM,
        projectId: ProjectId.ETHEREUM,
        amount: 1000n,
        usdValue: 1000n,
        ethValue: 1000n,
        asset: AssetId.USDC,
      },
      {
        timestamp,
        reportType: 'CBV',
        chainId: ChainId.ETHEREUM,
        projectId: ProjectId.ETHEREUM,
        amount: 2000n,
        usdValue: 2000n,
        ethValue: 2000n,
        asset: AssetId.OP,
      },
      {
        timestamp,
        reportType: 'NMV',
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
            assetType: 'CBV',
            assetId: AssetId.USDC,
            chainId: ChainId.ARBITRUM,
            usdValue: 2,
          },
          {
            assetType: 'CBV',
            assetId: AssetId.ETH,
            chainId: ChainId.ARBITRUM,
            usdValue: 1,
          },
        ],
        EBV: [
          {
            assetType: 'EBV',
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
            assetType: 'CBV',
            assetId: AssetId.OP,
            chainId: ChainId.ETHEREUM,
            usdValue: 20,
          },
        ],
        EBV: [
          {
            assetType: 'EBV',
            assetId: AssetId.USDC,
            chainId: ChainId.ETHEREUM,
            usdValue: 10,
          },
        ],
        NMV: [
          {
            assetType: 'NMV',
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
