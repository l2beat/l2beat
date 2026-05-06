import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
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
  tokenAddress: EthereumAddress
  tokenInfo: { symbol: string; decimals: number; priceId: string }
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
    tokens: [bucket.tokenInfo.symbol],
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
    let token = grouped.get(bucket.tokenInfo.symbol)
    if (!token) {
      token = {
        token: {
          address: bucket.tokenAddress,
          symbol: bucket.tokenInfo.symbol,
          decimals: bucket.tokenInfo.decimals,
          priceId: bucket.tokenInfo.priceId,
          sinceTimestamp: bucket.sinceTimestamp,
        },
        buckets: [],
      }
      grouped.set(bucket.tokenInfo.symbol, token)
    }

    token.token.sinceTimestamp = UnixTime(
      Math.min(
        token.token.sinceTimestamp ?? Number.MAX_SAFE_INTEGER,
        bucket.sinceTimestamp,
      ),
    )

    token.buckets.push({
      id: bucket.id,
      type: 'pool',
      label: `${bucket.tokenInfo.symbol} pool`,
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
    a.token.symbol.localeCompare(b.token.symbol, undefined, {
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

    const tokenAddress = isNativeEth
      ? EthereumAddress('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
      : EthereumAddress(
          ChainSpecificAddress.address(asset as ChainSpecificAddress),
        )
    const resolved = getTokenByAddress(tokenAddress.toString())
    assert(resolved, `Unknown asset ${asset}`)

    return {
      id: `privacy-pools-${resolved.symbol}-${pool.address}`,
      address: pool.address,
      tokenAddress,
      tokenInfo: {
        symbol: resolved.symbol,
        decimals: resolved.decimals,
        priceId: resolved.coingeckoId,
      },
      sinceBlock: pool.sinceBlock ?? 0,
      sinceTimestamp: UnixTime(pool.sinceTimestamp ?? 0),
      depositEvent: PRIVACY_POOLS_DEPOSIT_EVENT,
      withdrawalEvent: PRIVACY_POOLS_WITHDRAWAL_EVENT,
    }
  })
}
