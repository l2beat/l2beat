import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
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

function formatBasisPoints(value: number): string {
  return `${Number((value / 100).toFixed(4))}%`
}

interface PrivacyPoolsAssetConfig {
  minimumDepositAmount: string | number
  vettingFeeBPS: number
  maxRelayFeeBPS: number
}

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
  feeConfig: PrivacyPoolsAssetConfig
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

Privacy Pools are controlled by a ${discovery.getMultisigStats('Privacy Pools Multisig')} multisig, which has authority to stop deposits and manage the deposit whitelist, but users always have an option to publicly withdraw deposited tokens, linking their withdrawal to their deposit.

### Privacy considerations

Privacy Pools protocol supports [relayed withdrawals](https://etherscan.io/address/0x15e355024de1cdc74addea7ebdf98418ba5b1a2c#code#F1#L133), in which relayer processes withdrawals on user's behalf for a fee, which enables sending funds to fresh addresses.

Practical privacy also depends on the timing and amounts of deposits and withdrawals, underlying network and browser used to interact with Privacy Pools frontend (if used), RPC providers used to send transactions and query public blockchain state. Users are advised to research [OPSEC best practices](/publications/privacy-best-practices).

### Fees

Privacy Pools charges a mandatory onchain vetting fee on deposits and caps relayed-withdrawal fees per asset:
${formatPrivacyPoolsFeeSummary()}

The vetting fees are accumulated in the Entrypoint and can be withdrawn by its owner. Relayer fees are paid on withdrawals to the selected relayer and cannot exceed the per-asset cap; relayers can still choose their own quote below that cap and users can self-relay to not pay the fee.

### Compliance

The main feature of Privacy Pools is compliance, which is enforced through the ASP. Association set is a whitelist of deposits that are allowed to be withdrawn from the protocol. This set is managed in real time by the provider, which is currently a single entity. The full association set is published via IPFS, only its Merkle root is posted onchain. User's deposit could be excluded from the whitelist at any moment, in this case the user can still ragequit, i.e. publicly withdraw deposited funds and link them to their deposit.

ASP is designed to vouch that withdrawals from Privacy Pools are not related to any known illegal activity.

### Anonymity set

The anonymity set consists of all whitelisted deposits of the same token with the value greater than the withdrawal amount. Note that only deposits approved by the ASP add to the anonymity set. To maximize the anonymity set, users are recommended to withdraw smaller amounts and deposit popular tokens.`,
    links: {
      websites: ['https://privacypools.com'],
    },
    badges: [],
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
    attributes: [
      PRIVACY_ATTRIBUTES.immutable,
      PRIVACY_ATTRIBUTES.enforcedCompliance,
      PRIVACY_ATTRIBUTES.anyAmount,
      PRIVACY_ATTRIBUTES.sourceAvailable,
    ],
    riskSummary: `## Funds can be stolen if
1. the zk proof system is broken, allowing invalid withdrawals.
2. the [trusted setup](#trusted-setups) is compromised or all ceremony participants collude, allowing invalid withdrawals.
3. the Entrypoint owner deploys a malicious [upgrade](#upgrades-and-governance) that steals new deposits.
<br>
## Funds can be lost if
1. a user loses the secret and nullifier required to spend their deposit.
<br>
## Privacy can be lost if
1. no relayer is available and the withdrawal must be submitted from an address that can be linked to the user.
2. the ASP manager refuses to whitelist a deposit, forcing the user to either wait or exit publicly through ragequit.`,
    upgradesAndGovernance: `The ${discovery.getMultisigStats('Privacy Pools Multisig')} Privacy Pools Multisig can instantly change the system’s critical configs, including the Entrypoint implementation and ASP root used for private withdrawals. The ASP postman (EOA) can also remove any deposit from the whitelist at any time, forcing a public rage-quit if the affected party wishes to withdraw. The guaranteed immutable escape hatch is pool-level ragequit (public withdrawal) to the original depositor address, because that logic lives in the immutable pool contracts and does not depend on the Entrypoint registry and config. This means the system is permissioned in its deposit logic and deposit privacy, but non-custodial for deposited assets. Past, successful (non-ragequit) withdrawals can not be deanonymized by the protocol.`,
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
    const feeConfig = pool.values
      ?.assetConfigFromEntrypoint as unknown as PrivacyPoolsAssetConfig
    assert(feeConfig, `Missing fee config for ${pool.name}`)

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
      feeConfig,
      depositEvent: PRIVACY_POOLS_DEPOSIT_EVENT,
      withdrawalEvent: PRIVACY_POOLS_WITHDRAWAL_EVENT,
    }
  })
}

function formatPrivacyPoolsFeeSummary(): string {
  const grouped = new Map<string, string[]>()

  for (const bucket of BUCKETS) {
    const key = `${formatBasisPoints(
      bucket.feeConfig.vettingFeeBPS,
    )} vetting fee, ${formatBasisPoints(
      bucket.feeConfig.maxRelayFeeBPS,
    )} maximum relayer fee`
    const symbols = grouped.get(key) ?? []
    symbols.push(bucket.tokenInfo.symbol)
    grouped.set(key, symbols)
  }

  return Array.from(grouped.entries())
    .map(([key, symbols], index) => {
      const sortedSymbols = symbols.sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true }),
      )
      return `${index + 1}. ${key}: ${sortedSymbols.join(', ')}.`
    })
    .join('\n')
}
