import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
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

interface PrivacyPoolBucket {
  id: string
  address: ChainSpecificAddress
  tokenAddress: EthereumAddress
  tokenInfo: {
    symbol: string
    decimals: number
    priceId: string
    iconUrl: string | undefined
  }
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
    detailedDescription: `Privacy Pools is a non-custodial privacy protocol on Ethereum built around asset-specific pools and private withdrawals, adding compliance by whitelisting all legitimate deposits. A deposit creates a commitment, which is represented by secret and nullifier, and a later withdrawal uses a zero-knowledge proof to spend that commitment, either partially or in full, without revealing the matching deposit. Losing the secret and the nullifier would effectively mean losing deposited tokens.

Privacy pools are split by token, different pools are independent from each other. Deposits could be mixed only with other deposits of the same token. Arbitrary denominations of tokens could be deposited and withdrawn.

Privacy Pools are controlled by a 2/4 multisig, which has authority to stop deposits and manage the deposit whitelist, but users always have an option to publicly withdraw deposited tokens.

### Privacy considerations

Privacy Pools protocol supports [relayed withdrawals](https://etherscan.io/address/0x15e355024de1cdc74addea7ebdf98418ba5b1a2c#code#F1#L133), in which relayer processes withdrawals on user's behalf for a fee, which enables sending funds to fresh addresses.

Practical privacy also depends on the timing and amounts of deposits and withdrawals, underlying network and browser used to interact with Privacy Pools frontend (if used), RPC providers used to send transactions and query public blockchain state. Users are advised to research the best OPSEC practices.

### Compliance

The main feature of Privacy Pools is compliance, which is enforced through the ASP. Association set is a whitelist of deposits that are allowed to be withdrawn from the protocol. This set is managed in real time by the provider, which is currently a single entity. The full association set is published via IPFS, only its Merkle root is posted onchain. User's deposit could be excluded from the whitelist at any moment, in this case user can ragequit, i.e. publicly withdraw deposited funds.

ASP is designed to guarantee that withdrawals from Privacy Pools are not related to any known illegal activity.`,
    links: {
      websites: ['https://www.privacypools.com'],
    },
    badges: [BADGES.Privacy.Compliance],
  },
  escrows: BUCKETS.map((bucket) => ({
    address: ChainSpecificAddress.address(bucket.address),
    chain: ChainSpecificAddress.longChain(bucket.address),
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
          iconUrl: bucket.tokenInfo.iconUrl,
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
      sinceTimestamp: bucket.sinceTimestamp,
      deposit: {
        event: bucket.depositEvent,
        extractor: 'privacyPoolsValue',
        params: {},
      },
      withdrawal: {
        event: bucket.withdrawalEvent,
        extractor: 'privacyPoolsValue',
        params: {},
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
      id: `privacy-pools-${resolved.symbol}`,
      address: pool.address,
      tokenAddress,
      tokenInfo: {
        symbol: resolved.symbol,
        decimals: resolved.decimals,
        priceId: resolved.coingeckoId,
        iconUrl: resolved.iconUrl,
      },
      sinceTimestamp: UnixTime(pool.sinceTimestamp ?? 0),
      depositEvent: PRIVACY_POOLS_DEPOSIT_EVENT,
      withdrawalEvent: PRIVACY_POOLS_WITHDRAWAL_EVENT,
    }
  })
}
