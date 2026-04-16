import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject, ProjectPrivacyAsset } from '../../types'
import {
  ETHEREUM_BLOCKS_IN_7_DAYS,
  ETHEREUM_BLOCKS_IN_30_DAYS,
  TICKERS,
} from '../tornado-cash/tornado-cash'

const discovery = new ProjectDiscovery('privacy-pools')
const DEPOSITED_EVENT =
  '0xe3b53cd1a44fbf11535e145d80b8ef1ed6d57a73bf5daa7e939b6b01657d6549'
const NATIVE_ETH_ASSET = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
const MIN_RELEVANT_DEPOSITS_PRIVACY_POOLS = 20

export const privacyPools: BaseProject = {
  id: ProjectId('privacy-pools'),
  slug: 'privacy-pools',
  name: 'Privacy Pools',
  shortName: undefined,
  addedAt: UnixTime(0),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A selective-disclosure privacy system for Ethereum that adds compliance-aware association sets.',
    links: {
      websites: ['https://www.privacypools.com'],
    },
    badges: [],
  },
  privacyInfo: {
    // TODO: Replace with the actual trusted setup used by the project.
    trustedSetup: TRUSTED_SETUPS.Stub,
    assets: getPrivacyPoolsAssets(),
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}

function getPrivacyPoolsAssets(): ProjectPrivacyAsset[] {
  const pools = discovery.getContractValue<
    Record<string, { _pool: string; _scope: string }[]>
  >('Entrypoint', 'pools')

  type AssetGroup = {
    asset: ProjectPrivacyAsset['asset']
    buckets: ProjectPrivacyAsset['buckets']
  }

  const grouped = new Map<string, AssetGroup>()

  for (const poolAddress of Object.keys(pools)) {
    const pool = discovery.getContract(poolAddress)
    const asset = pool.values?.ASSET?.toString()

    if (
      Number(pool.values?.totalDeposits ?? 0) <
      MIN_RELEVANT_DEPOSITS_PRIVACY_POOLS
    ) {
      // pool is too small
      continue
    }

    if (!asset) {
      throw new Error(`Missing asset on Privacy Pools pool: ${poolAddress}`)
    }

    const isNativeEth = asset === `eth:${NATIVE_ETH_ASSET}`
    const tokenAddress = isNativeEth
      ? undefined
      : ChainSpecificAddress.address(ChainSpecificAddress(asset))
    const tokenInfo =
      isNativeEth || tokenAddress === undefined
        ? { ticker: 'ETH' }
        : TICKERS[tokenAddress]

    if (!tokenInfo) {
      throw new Error(
        `Missing ticker metadata for Privacy Pools token: ${asset}`,
      )
    }

    const groupKey = tokenAddress ?? NATIVE_ETH_ASSET
    const existing = grouped.get(groupKey)
    let group = existing
    if (!group) {
      if (isNativeEth) {
        group = {
          asset: { symbol: tokenInfo.ticker },
          buckets: [],
        }
      } else {
        if (tokenAddress === undefined) {
          throw new Error(`Invalid Privacy Pools token address: ${asset}`)
        }

        group = {
          asset: {
            address: EthereumAddress(tokenAddress),
            symbol: tokenInfo.ticker,
          },
          buckets: [],
        }
      }
    }

    group.buckets.push({
      id: `privacy-pools-${tokenInfo.ticker}-${ChainSpecificAddress.address(pool.address)}`,
      type: 'pool',
      label: tokenInfo.ticker,
      address: pool.address,
      totalValue: isNativeEth
        ? {
            type: 'nativeBalance',
            chain: 'ethereum',
            holder: pool.address,
          }
        : {
            type: 'erc20BalanceOf',
            chain: 'ethereum',
            tokenAddress: ChainSpecificAddress(asset),
            holder: pool.address,
          },
      deposits: {
        total: {
          type: 'discoveryValue',
          contract: pool.address.toString(),
          key: 'totalDeposits',
        },
        last7d: {
          type: 'eventCount',
          chain: 'ethereum',
          event: DEPOSITED_EVENT,
          address: pool.address,
          fromLastBlock: ETHEREUM_BLOCKS_IN_7_DAYS,
        },
        last30d: {
          type: 'eventCount',
          chain: 'ethereum',
          event: DEPOSITED_EVENT,
          address: pool.address,
          fromLastBlock: ETHEREUM_BLOCKS_IN_30_DAYS,
        },
      },
    })

    grouped.set(groupKey, group)
  }

  return [...grouped.values()]
    .map((group) => ({
      asset: group.asset,
      buckets: group.buckets.sort((a, b) =>
        a.id.localeCompare(b.id, undefined, { numeric: true }),
      ),
    }))
    .sort((a, b) =>
      (a.asset.symbol ?? '').localeCompare(b.asset.symbol ?? '', undefined, {
        numeric: true,
      }),
    )
}
