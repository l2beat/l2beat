import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject, ProjectPrivacyToken } from '../../types'

const discovery = new ProjectDiscovery('privacy-pools')

const PRIVACY_POOLS_DEPOSIT_EVENT =
  '0xe3b53cd1a44fbf11535e145d80b8ef1ed6d57a73bf5daa7e939b6b01657d6549'
const PRIVACY_POOLS_WITHDRAWAL_EVENT =
  '0x75e161b3e824b114fc1a33274bd7091918dd4e639cede50b78b15a4eea956a21'
const MIN_RELEVANT_DEPOSITS_PRIVACY_POOLS = 20

interface PrivacyPoolBucket {
  id: string
  address: ChainSpecificAddress
  symbol: string
  decimals: number
  sinceBlock: number
  sinceTimestamp: UnixTime
  depositEvent: string
  withdrawalEvent: string
}

const BUCKETS = getPrivacyPoolBuckets()

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
  escrows: BUCKETS.map((bucket) => ({
    address: ChainSpecificAddress.address(bucket.address),
    chain: 'ethereum',
    sinceTimestamp: bucket.sinceTimestamp,
    tokens: [bucket.symbol],
  })),
  tvsInfo: {
    associatedTokens: [],
    warnings: [],
  },
  privacyInfo: {
    trustedSetup: TRUSTED_SETUPS.PrivacyPools,
    tokens: getPrivacyTokens(),
    riskSummary: `## Funds can be lost if
1. the zk proof system is broken, allowing invalid withdrawals.
2. the [trusted setup](#trusted-setups) is compromised or all ceremony participants collude, allowing invalid withdrawals.
3. a user loses the secret and nullifier required to spend their deposit.
4. the Entrypoint owner deploys a malicious [upgrade](#upgrades-and-governance) that steals new deposits.
<br>
## Privacy can be lost if
1. no relayer is available and the withdrawal must be submitted from an address that can be linked to the user.
2. the ASP manager refuses to whitelist a deposit, forcing the user to either wait or exit publicly through ragequit.`,
    upgradesAndGovernance: `Privacy pools Entrypoint contract is owned by a 2/4 Multisig ([0xAd7f9A19E2598b6eFE0A25C84FB1c87F81eB7159](https://etherscan.io/address/0xAd7f9A19E2598b6eFE0A25C84FB1c87F81eB7159)). 
    
    It is a powerful role that has the authority to upgrade the Entrypoint contract, through which all deposits go. It can also manage minimum deposit amount, deposit fee, disable deposits on pools and manage ASP postman address that manages whitelisted privacy pools deposits.
    
    Entrypoint owner cannot prevent private or public withdrawals from the pools.`,
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}

function getPrivacyTokens(): ProjectPrivacyToken[] {
  const grouped = new Map<string, ProjectPrivacyToken>()

  for (const bucket of BUCKETS) {
    let token = grouped.get(bucket.symbol)
    if (!token) {
      token = {
        token: {
          symbol: bucket.symbol,
          decimals: bucket.decimals,
        },
        buckets: [],
      }
      grouped.set(bucket.symbol, token)
    }

    token.buckets.push({
      id: bucket.id,
      type: 'pool',
      label: `${bucket.symbol} pool`,
      address: bucket.address,
      flows: {
        sinceBlock: bucket.sinceBlock,
        deposit: {
          chain: 'ethereum',
          event: bucket.depositEvent,
          address: bucket.address,
          extractor: 'privacyPoolsValue',
          params: {},
        },
        withdrawal: {
          chain: 'ethereum',
          event: bucket.withdrawalEvent,
          address: bucket.address,
          extractor: 'privacyPoolsValue',
          params: {},
        },
      },
    })
  }

  return Array.from(grouped.values()).sort((a, b) =>
    (a.token.symbol ?? '').localeCompare(b.token.symbol ?? '', undefined, {
      numeric: true,
    }),
  )
}

function getPrivacyPoolBuckets(): PrivacyPoolBucket[] {
  const pools = discovery
    .getContracts()
    .filter((entry) => entry.template?.startsWith('privacy-pools/PrivacyPool'))
    .filter(
      (pool) =>
        Number(pool.values?.totalDeposits ?? 0) >=
        MIN_RELEVANT_DEPOSITS_PRIVACY_POOLS,
    )

  return pools.map((pool) => {
    const asset = pool.values?.ASSET?.toString()
    const isNativeEth =
      asset === 'eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    const symbol = isNativeEth ? 'ETH' : getSymbolFromAsset(asset)
    const decimals = isNativeEth ? 18 : getDecimalsFromAsset(asset)
    if (!symbol || !decimals) {
      throw new Error(`Unknown asset ${asset}`)
    }
    return {
      id: `privacy-pools-${symbol}-${pool.address}`,
      address: pool.address,
      symbol,
      decimals,
      sinceBlock: pool.sinceBlock ?? 0,
      sinceTimestamp: UnixTime(pool.sinceTimestamp ?? 0),
      depositEvent: PRIVACY_POOLS_DEPOSIT_EVENT,
      withdrawalEvent: PRIVACY_POOLS_WITHDRAWAL_EVENT,
    }
  })
}

function getSymbolFromAsset(asset: string | undefined): string | undefined {
  if (!asset) return undefined
  const address = ChainSpecificAddress.address(asset as ChainSpecificAddress)
  const symbolMap: Record<string, string> = {
    '0x6B175474E89094C44Da98b954EedeAC495271d0F': 'DAI',
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': 'USDC',
    '0xdAC17F958D2ee523a2206206994597C13D831ec7': 'USDT',
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': 'WBTC',
    '0xdC035D45d973E3EC169d2276DDab16f1e407384F': 'USDS',
    '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0': 'wstETH',
    '0x4c9EDD5852cd905f086C759E8383e09bff1E68B3': 'USDe',
    '0x085780639CC2cACd35E474e71f4d000e2405d8f6': 'fxUSD',
    '0x6440f144b7e50D6a8439336510312d2F54beB01D': 'BOLD',
    '0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d': 'USD1',
    '0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29': 'frxUSD',
    '0xDcEe70654261AF21C44c093C300eD3Bb97b78192': 'wOETH',
  }
  return symbolMap[address]
}

function getDecimalsFromAsset(asset: string | undefined): number | undefined {
  if (!asset) return undefined
  const address = ChainSpecificAddress.address(asset as ChainSpecificAddress)
  const decimalsMap: Record<string, number> = {
    '0x6B175474E89094C44Da98b954EedeAC495271d0F': 18,
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': 6,
    '0xdAC17F958D2ee523a2206206994597C13D831ec7': 6,
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': 8,
    '0xdC035D45d973E3EC169d2276DDab16f1e407384F': 18,
    '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0': 18,
    '0x4c9EDD5852cd905f086C759E8383e09bff1E68B3': 18,
    '0x085780639CC2cACd35E474e71f4d000e2405d8f6': 18,
    '0x6440f144b7e50D6a8439336510312d2F54beB01D': 18,
    '0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d': 18,
    '0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29': 18,
    '0xDcEe70654261AF21C44c093C300eD3Bb97b78192': 18,
  }
  return decimalsMap[address]
}
