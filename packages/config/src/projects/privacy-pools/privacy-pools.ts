import {
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
import type { BaseProject, ProjectPrivacyAsset } from '../../types'
import { TICKERS } from '../tornado-cash/tornado-cash'

const discovery = new ProjectDiscovery('privacy-pools')
const DEPOSITED_EVENT =
  '0xe3b53cd1a44fbf11535e145d80b8ef1ed6d57a73bf5daa7e939b6b01657d6549'
const WITHDRAWN_EVENT =
  '0x75e161b3e824b114fc1a33274bd7091918dd4e639cede50b78b15a4eea956a21'
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
    detailedDescription: `Privacy Pools is a non-custodial privacy protocol on Ethereum built around asset-specific pools and private withdrawals, adding compliance by whitelisting all legitimate deposits. A deposit creates a commitment, which is represented by secret and nullifier, and a later withdrawal uses a zero-knowledge proof to spend that commitment, either partially or in full, without revealing the matching deposit. Losing the secret and the nullifier would effectively mean losing deposited tokens. 

Privacy pools are split by token, different pools are independent from each other. Deposits could be mixed only with other deposits of the same token. Arbitrary denominations of tokens could be deposited and withdrawn.

Privacy Pools are controlled by a 2/4 multisig, which has authority to stop deposits and manage the deposit whitelist, but users always have an option to publicly withdraw deposited tokens.

### Privacy considerations

Privacy Pools protocol supports [relayed withdrawals](https://etherscan.io/address/0x15e355024de1cdc74addea7ebdf98418ba5b1a2c#code#F1#L133), in which relayer processes withdrawals on user’s behalf for a fee, which enables sending funds to fresh addresses.

Practical privacy also depends on the timing and amounts of deposits and withdrawals, underlying network and browser used to interact with Privacy Pools frontend (if used), RPC providers used to send transactions and query public blockchain state. Users are advised to research the best OPSEC practices.

### Compliance

The main feature of Privacy Pools is compliance, which is enforced through the ASP. Association set is a whitelist of deposits that are allowed to be withdrawn from the protocol. This set is managed in real time by the provider, which is currently a single entity. The full association set is published via IPFS, only its Merkle root is posted onchain. User's deposit could be excluded from the whitelist at any moment, in this case user can ragequit, i.e. publicly withdraw deposited funds. 

ASP is designed to guarantee that withdrawals from Privacy Pools are not related to any known illegal activity.`,
    links: {
      websites: ['https://www.privacypools.com'],
    },
    badges: [BADGES.Privacy.Compliance],
  },
  privacyInfo: {
    trustedSetup: TRUSTED_SETUPS.PrivacyPools,
    assets: getPrivacyPoolsAssets(),
    riskSummary: `## Funds can be lost if
1. the zk proof system is broken, allowing invalid withdrawals.
2. the [trusted setup](#trusted-setups) is compromised or all ceremony participants collude, allowing invalid withdrawals.
3. a user loses the secret and nullifier required to spend their deposit.
4. the Entrypoint owner deploys a malicious [upgrade](#upgrades-and-governance) that steals new deposits.

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
      flows: {
        sinceBlock: pool.sinceBlock ?? 0,
        deposit: {
          chain: 'ethereum',
          event: DEPOSITED_EVENT,
          address: pool.address,
          extractor: 'privacyPoolsValue',
          params: {},
        },
        withdrawal: {
          chain: 'ethereum',
          event: WITHDRAWN_EVENT,
          address: pool.address,
          extractor: 'privacyPoolsValue',
          params: {},
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
