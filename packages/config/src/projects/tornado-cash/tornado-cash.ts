import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject, ProjectPrivacyAsset } from '../../types'

const discovery = new ProjectDiscovery('tornado-cash')

const ETH_ASSET_KEY = 'ETH'
const ETH_TOKEN_INFO = { ticker: 'ETH', decimals: 18 } as const
const TORNADO_DEPOSIT_EVENT =
  '0xa945e51eec50ab98c161376f0db4cf2aeba3ec92755fe2fcd388bdbbb80ff196'
export const ETHEREUM_BLOCKS_IN_7_DAYS = (7 * 24 * 60 * 60) / 12
export const ETHEREUM_BLOCKS_IN_30_DAYS = (30 * 24 * 60 * 60) / 12
const MIN_RELEVANT_DEPOSITS_TORNADO = 100

function formatDenomination(amount: bigint, decimals: number): string {
  return utils.formatUnits(amount, decimals).replace(/\.?0+$/, '')
}

// For demo purposes I hardcode tickers, decimals and prices here. All addresses are on Ethereum.
// It's dirty and hacky, in the prod version this should be solved by token db
export const TICKERS: Record<
  string,
  { ticker: string; decimals: number; price: number | null }
> = {
  '0x6B175474E89094C44Da98b954EedeAC495271d0F': {
    ticker: 'DAI',
    decimals: 18,
    price: 1.0,
  },
  '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643': {
    ticker: 'cDAI',
    decimals: 8,
    price: 0.02, // exchange rate token, not $1
  },
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': {
    ticker: 'USDC',
    decimals: 6,
    price: 1.0,
  },
  '0xdAC17F958D2ee523a2206206994597C13D831ec7': {
    ticker: 'USDT',
    decimals: 6,
    price: 1.0,
  },
  '0xdC035D45d973E3EC169d2276DDab16f1e407384F': {
    ticker: 'USDS',
    decimals: 18,
    price: 1.0,
  },
  '0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD': {
    ticker: 'sUSDS',
    decimals: 18,
    price: 1.02, // yield-bearing, slightly above peg
  },
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': {
    ticker: 'WBTC',
    decimals: 8,
    price: 72000,
  },
  '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0': {
    ticker: 'wstETH',
    decimals: 18,
    price: 3800,
  },
  '0x4c9EDD5852cd905f086C759E8383e09bff1E68B3': {
    ticker: 'USDe',
    decimals: 18,
    price: 1.0,
  },
  '0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d': {
    ticker: 'USD1',
    decimals: 18,
    price: 1.0,
  },
  '0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29': {
    ticker: 'frxUSD',
    decimals: 18,
    price: 1.0,
  },
  '0xDcEe70654261AF21C44c093C300eD3Bb97b78192': {
    ticker: 'WOETH',
    decimals: 18,
    price: 3900,
  },
  '0x085780639CC2cACd35E474e71f4d000e2405d8f6': {
    ticker: 'fxUSD',
    decimals: 18,
    price: 1.0,
  },
  '0x6440f144b7e50D6a8439336510312d2F54beB01D': {
    ticker: 'BOLD',
    decimals: 18,
    price: null, // illiquid / unclear market price
  },
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': {
    ticker: 'WETH',
    decimals: 18,
    price: 3600,
  },
  '0x85F17Cf997934a597031b2E18a9aB6ebD4B9f6a4': {
    ticker: 'NEAR',
    decimals: 24,
    price: 6.5,
  },
  '0xE76c6C83BC8D0c0c2cc3c6d1E7C6F21673A7A33d': {
    ticker: 'RAIL',
    decimals: 18,
    price: 1.2,
  },
  '0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb': {
    ticker: 'FLUID',
    decimals: 18,
    price: 7.0,
  },
}

export const tornadoCash: BaseProject = {
  id: ProjectId('tornado-cash'),
  slug: 'tornado-cash',
  name: 'Tornado Cash',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-04-15')),
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
      'A classic Ethereum mixer design based on fixed-denomination pools and zk withdrawals.',
    links: {
      websites: ['https://tornadocash.network'],
    },
    badges: [],
  },
  privacyInfo: {
    // TODO: Replace with the actual trusted setup used by the project.
    trustedSetup: TRUSTED_SETUPS.Stub,
    assets: getTornadoAssets(),
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}

function getTornadoAssets(): ProjectPrivacyAsset[] {
  // InstanceRegistry is the source of truth for all currently known Tornado pools.
  const pools = discovery
    .getContractValue<string[]>('InstanceRegistry', 'getAllInstanceAddresses')
    .map((address) => discovery.getContract(address))

  const grouped = new Map<
    string,
    {
      asset: ProjectPrivacyAsset['asset']
      buckets: NonNullable<ProjectPrivacyAsset['buckets']>
    }
  >()

  for (const pool of pools) {
    if (Number(pool.values?.nextIndex ?? 0) < MIN_RELEVANT_DEPOSITS_TORNADO) {
      // pool is too small
      continue
    }
    // ERC-20 and cToken pools expose token, while ETH pools are native and omit it.
    const token = pool.values?.token?.toString()
    const isNativeEth = token === undefined
    const tokenAddress = isNativeEth
      ? undefined
      : ChainSpecificAddress.address(ChainSpecificAddress(token))
    const tokenInfo =
      isNativeEth || tokenAddress === undefined
        ? ETH_TOKEN_INFO
        : TICKERS[tokenAddress]

    if (!tokenInfo) {
      throw new Error(`Missing ticker metadata for Tornado token: ${token}`)
    }
    if (!isNativeEth && tokenAddress === undefined) {
      throw new Error(`Invalid Tornado token address: ${token}`)
    }

    const amount = formatDenomination(
      BigInt(pool.values?.denomination?.toString() ?? 0),
      tokenInfo.decimals,
    )

    // Each asset aggregates all its fixed-denomination pools into buckets.
    const groupKey = tokenAddress ?? ETH_ASSET_KEY
    const existing:
      | {
          asset: ProjectPrivacyAsset['asset']
          buckets: NonNullable<ProjectPrivacyAsset['buckets']>
        }
      | undefined = grouped.get(groupKey)

    let group = existing
    if (!group) {
      if (isNativeEth) {
        group = {
          asset: { symbol: ETH_TOKEN_INFO.ticker },
          buckets: [],
        }
      } else {
        const nonNativeTokenAddress = tokenAddress
        if (nonNativeTokenAddress === undefined) {
          throw new Error(`Invalid Tornado token address: ${token}`)
        }

        group = {
          asset: {
            address: EthereumAddress(nonNativeTokenAddress),
            symbol: tokenInfo.ticker,
          },
          buckets: [],
        }
      }
    }

    // nextIndex tracks the cumulative number of deposits into a given pool.
    group.buckets.push({
      id: `tornado-${tokenInfo.ticker}-${amount}`,
      type: 'denomination',
      label: `${tokenInfo.ticker} ${amount}`,
      address: pool.address,
      denomination: amount,
      totalValue: isNativeEth
        ? {
            type: 'nativeBalance',
            chain: 'ethereum',
            holder: pool.address,
          }
        : {
            type: 'erc20BalanceOf',
            chain: 'ethereum',
            tokenAddress: pool.values?.token
              ? ChainSpecificAddress(pool.values.token.toString())
              : pool.address,
            holder: pool.address,
          },
      deposits: {
        total: {
          type: 'discoveryValue',
          contract: pool.address.toString(),
          key: 'nextIndex',
        },
        last7d: {
          type: 'eventCount',
          chain: 'ethereum',
          event: TORNADO_DEPOSIT_EVENT,
          address: pool.address,
          fromLastBlock: ETHEREUM_BLOCKS_IN_7_DAYS,
        },
        last30d: {
          type: 'eventCount',
          chain: 'ethereum',
          event: TORNADO_DEPOSIT_EVENT,
          address: pool.address,
          fromLastBlock: ETHEREUM_BLOCKS_IN_30_DAYS,
        },
      },
    })

    grouped.set(groupKey, group)
  }

  // Keep output deterministic for stable diffs and UI rendering.
  return [...grouped.values()]
    .map((group) => ({
      asset: group.asset,
      buckets: group.buckets.sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { numeric: true }),
      ),
    }))
    .sort((a, b) =>
      (a.asset.symbol ?? '').localeCompare(b.asset.symbol ?? '', undefined, {
        numeric: true,
      }),
    )
}
