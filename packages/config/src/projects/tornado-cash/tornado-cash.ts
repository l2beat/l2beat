import {
  ChainSpecificAddress,
  EthereumAddress,
  formatLargeNumber,
  formatSeconds,
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
const TORNADO_WITHDRAWAL_EVENT =
  '0xe9e508bad6d4c3227e881ca19068f099da81b5164dd6d62b2eaf1e8bc6c34931'
export const ETHEREUM_BLOCKS_IN_7_DAYS = (7 * 24 * 60 * 60) / 12
export const ETHEREUM_BLOCKS_IN_30_DAYS = (30 * 24 * 60 * 60) / 12
const MIN_RELEVANT_DEPOSITS_TORNADO = 100
const proposalThreshold = discovery.getContractValueBigInt(
  'GovernanceProposalStateUpgrade',
  'PROPOSAL_THRESHOLD',
)
const quorumVotes = discovery.getContractValueBigInt(
  'GovernanceProposalStateUpgrade',
  'QUORUM_VOTES',
)
const closingPeriod = discovery.getContractValue<number>(
  'GovernanceProposalStateUpgrade',
  'CLOSING_PERIOD',
)
const executionDelay = discovery.getContractValue<number>(
  'GovernanceProposalStateUpgrade',
  'EXECUTION_DELAY',
)
const executionExpiration = discovery.getContractValue<number>(
  'GovernanceProposalStateUpgrade',
  'EXECUTION_EXPIRATION',
)
const voteExtendTime = discovery.getContractValue<number>(
  'GovernanceProposalStateUpgrade',
  'VOTE_EXTEND_TIME',
)
const votingDelay = discovery.getContractValue<number>(
  'GovernanceProposalStateUpgrade',
  'VOTING_DELAY',
)
const votingPeriod = discovery.getContractValue<number>(
  'GovernanceProposalStateUpgrade',
  'VOTING_PERIOD',
)

function formatDenomination(amount: bigint, decimals: number): string {
  return utils.formatUnits(amount, decimals).replace(/\.?0+$/, '')
}

function formatTornAmount(amount: bigint): string {
  return `${formatLargeNumber(Number(amount / 10n ** 18n))} TORN`
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
    detailedDescription: `Tornado Cash is a non-custodial mixer on Ethereum built around separate fixed-denomination pools, which prevents linking deposits and withdrawals via the amount. A deposit publishes a commitment into a Merkle tree producing a secret note, and a later withdrawal uses a zk-SNARK proof and the note to send the same denomination to a different address, breaking the deposit-withdrawal link. The note represents ownership of tokens in a Tornado cash pool, and losing it will effectively mean losing the tokens.

The core mixer contracts are immutable and have no admin, pause, or upgrade path, so funds can only move out with a valid proof. However Tornado cash features TORN token governance, which controls peripheral smart contracts: official pool registry, relayer registration requirement and TORN tokenomics.

### Privacy considerations

Tornado cash introduces a permissionless relayer network, which is essential for practical privacy. Relayers process withdrawals from Tornado cash pools on user's behalf for a fee, which enables withdrawals to fresh addresses without funding them before the withdrawal. Without an active relayer network, practical privacy of Tornado cash deteriorates significantly.

Practical privacy also depends on the timing of deposits and withdrawals, underlying network and browser used to interact with Tornado cash frontend (if used), RPC providers used to send transactions and query public blockchain state. Users are advised to research the best OPSEC practices.

### Compliance

Tornado cash does not have any protocol-level compliance features. However, it provides an optional [Compliance Tool](https://docs.tornado.cash/tornado-cash-classic/compliance-tool), which allows users to generate a proof linking a withdrawal to a specific deposit without revealing this information publicly onchain. This enables users to selectively disclose the origin of funds to third parties, such as exchanges or regulators.

Protocol pools were [sanctioned by OFAC in August 2022](https://home.treasury.gov/news/press-releases/jy0916), flagging funds moved through these smart contracts as illicit and forcing Tornado Cash transaction censorship. Sanctions were lifted on March 21, 2025.

### Anonymity set

User's anonymity set consists of all previous deposits into the same bucket (i.e. deposits of the same token and amount). Deposits could be mixed only with other deposits of the same token and denomination. To maximize the anonymity set, users are advised to deposit into the buckets with most usage.
`,
    links: {
      websites: [
        'https://ipfs.io/ipfs/bafybeie5hxovqc4ifcnrnhvmjbefxgeix6oqvzaspyytdxiyscji22v5pu',
      ],
    },
    badges: [],
  },
  privacyInfo: {
    trustedSetup: TRUSTED_SETUPS.TornadoCash,
    assets: getTornadoAssets(),
    riskSummary: `## Funds can be lost if
1. the zk proof system is broken, allowing invalid withdrawals.
2. the [trusted setup](#trusted-setups) is compromised or all ceremony participants collude, allowing invalid withdrawals.
3. a user loses the note secrets required to withdraw.  
<br>
## Privacy can be lost if
1. no relayer is available and the withdrawal must be submitted from an address that can be linked to the user.`,
    upgradesAndGovernance: `
Tornado cash has a TORN DAO, which does not have the authority to upgrade or modify existing pools in any way. However it controls a significant portion of the Tornado cash protocol and periphery, including:

1. **Default router for deposits and withdrawals and the official registry for supported pools**. Malicious upgrades of these components could lead to users losing deposited tokens.  
2. **Standard UI registered on IPFS and associated UI content hash**. Malicious upgrades of these components could lead to users losing deposited tokens, which [was exploited in 2024](https://www.coindesk.com/business/2024/02/26/tornado-cash-reportedly-suffers-backend-exploit-user-deposits-at-risk?utm_source=chatgpt.com).  
3. **TORN token itself**. Malicious upgrades of the token could lead to token transfers being frozen.  
4. **Registered relayers**. Malicious upgrades of these components could remove all registered relayers, forcing users to self-withdraw.

### **Governance flow**

1. Users lock TORN token in the Governance contract ([0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce](https://etherscan.io/address/0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce)). After voting or proposing, staked tokens are locked for several days, preventing governance hopping. The stake could be delegated to another address.  
2. Anyone with at least ${formatTornAmount(proposalThreshold)} could create a proposal. Proposal spends ${formatSeconds(votingDelay)} in the Pending state, where voting is still disabled, followed by ${formatSeconds(votingPeriod)} of Active state, when votes are cast. If the vote outcome changes in the last ${formatSeconds(closingPeriod)}, voting period is extended by another ${formatSeconds(voteExtendTime)}.  
3. Proposal is accepted by simple majority with a required quorum of ${formatTornAmount(quorumVotes)}. Once accepted, ${formatSeconds(executionDelay)} of Timelocked state allow exiting the protocol to everyone who disagrees with the proposal. Afterwards, the proposal could be permissionlessly executed within ${formatSeconds(executionExpiration)}. 
    `,
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

    const denominationAmount = BigInt(
      pool.values?.denomination?.toString() ?? 0,
    )
    const amount = formatDenomination(denominationAmount, tokenInfo.decimals)

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
      flows: {
        sinceBlock: pool.sinceBlock ?? 0,
        deposit: {
          chain: 'ethereum',
          event: TORNADO_DEPOSIT_EVENT,
          address: pool.address,
          extractor: 'fixedAmount',
          params: {
            amount: denominationAmount.toString(),
          },
        },
        withdrawal: {
          chain: 'ethereum',
          event: TORNADO_WITHDRAWAL_EVENT,
          address: pool.address,
          extractor: 'fixedAmount',
          params: {
            amount: denominationAmount.toString(),
          },
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
