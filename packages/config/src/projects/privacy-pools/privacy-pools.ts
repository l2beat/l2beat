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
    detailedDescription: `Privacy Pools is a non-custodial privacy protocol on Ethereum built around asset-specific pools and private withdrawals. A deposit creates a commitment from the deposited value, a pool-specific label, and a precommitment derived from a secret and nullifier, and a later withdrawal uses a zero-knowledge proof to spend that commitment, either partially or in full, without revealing the matching deposit.

Compliance is enforced through the ASP layer. A private withdrawal must prove both ownership of a commitment and inclusion of its label in the latest approved association set, so only ASP-approved deposits can exit privately. Withdrawals can be submitted directly or relayed through the Entrypoint, while the pool checks the state root, ASP root, and nullifier uniqueness before spending the old commitment and inserting a new one for any remainder.

The main tradeoff is upgradeability and ASP dependence. The Entrypoint is a UUPS proxy with privileged roles for pool management and ASP root updates, while the asset-specific pools and proof verifiers are immutable. If a label is excluded or revoked from the ASP set, the original depositor can still publicly recover the full remaining amount through ragequit, so funds are not trapped by an ASP decision.`,
    links: {
      websites: ['https://www.privacypools.com'],
    },
    badges: [],
  },
  privacyInfo: {
    trustedSetup: TRUSTED_SETUPS.PrivacyPools,
    assets: getPrivacyPoolsAssets(),
    upgradesAndGovernance: `Privacy pools Entrypoint contract is owned by a 2/4 Multisig ([0xAd7f9A19E2598b6eFE0A25C84FB1c87F81eB7159](https://etherscan.io/address/0xAd7f9A19E2598b6eFE0A25C84FB1c87F81eB7159)). 
    
    It is a powerful role that has the authority to upgrade the Entrypoint contract, through which all deposits go. It can also manage minimum deposit amount, deposit fee, disable deposits on pools and manage ASP postman address that manages whitelisted privacy pools deposits.
    
    Entrypoint owner cannot prevent private or public withdrawals from the pools.`
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
