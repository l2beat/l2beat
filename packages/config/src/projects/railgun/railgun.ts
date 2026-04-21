import {
  ChainSpecificAddress,
  EthereumAddress,
  formatLargeNumber,
  formatSeconds,
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

const discovery = new ProjectDiscovery('railgun')
const RAILGUN_SHIELD_EVENT =
  '0x3a5b9dc26075a3801a6ddccf95fec485bb7500a91b44cec1add984c21ee6db3b'
const RAILGUN_UNSHIELD_EVENT =
  '0xd93cf895c7d5b2cd7dc7a098b678b3089f37d91f48d9b83a0800a91cbdf05284'

const stakingContractAddress = discovery.getContract('Staking').address
const stakeLocktime = discovery.getContractValue<number>(
  'Staking',
  'STAKE_LOCKTIME',
)
const proposalSponsorThreshold = discovery.getContractValueBigInt(
  'Voting',
  'PROPOSAL_SPONSOR_THRESHOLD',
)
const sponsorWindow = discovery.getContractValue<number>(
  'Voting',
  'SPONSOR_WINDOW',
)
const votingStartOffset = discovery.getContractValue<number>(
  'Voting',
  'VOTING_START_OFFSET',
)
const votingYayEndOffset = discovery.getContractValue<number>(
  'Voting',
  'VOTING_YAY_END_OFFSET',
)
const votingNayEndOffset = discovery.getContractValue<number>(
  'Voting',
  'VOTING_NAY_END_OFFSET',
)
const executionStartOffset = discovery.getContractValue<number>(
  'Voting',
  'EXECUTION_START_OFFSET',
)
const executionEndOffset = discovery.getContractValue<number>(
  'Voting',
  'EXECUTION_END_OFFSET',
)
const quorum = discovery.getContractValueBigInt('Voting', 'QUORUM')

function formatRailAmount(amount: bigint): string {
  return `${formatLargeNumber(Number(amount / 10n ** 18n))} RAIL`
}

// Manually specifying all tokens that have >100K value on Railgun.
// In future we might want to decide tokens of interest dynamically with more advanced logic.
const TRACKED_TOKENS = [
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  '0x85F17Cf997934a597031b2E18a9aB6ebD4B9f6a4',
  '0xE76c6C83BC8D0c0c2cc3c6d1E7C6F21673A7A33d',
  '0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb',
] as const

export const railgun: BaseProject = {
  id: ProjectId('railgun'),
  slug: 'railgun',
  name: 'Railgun',
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
      'An onchain privacy system for Ethereum based on encrypted UTXO-style private balances and zk-proven DeFi interactions.',
    detailedDescription: `Railgun is a non-custodial privacy protocol on Ethereum built around encrypted UTXO-style private balances rather than fixed-denomination pools. A shield transaction moves assets from a public 0x address into the Railgun contract and creates encrypted commitments in a Merkle-tree state, and later private transfers or unshields use zk-SNARK proofs to spend those commitments without revealing the sender, recipient, token type, or amount.

Because balances are variable-amount UTXOs, Railgun supports private transfers and cross-contract interactions without fragmenting liquidity across denominations. External DeFi calls are executed through the Relay Adapt flow, which temporarily unshields tokens into an adapter contract, performs a sequence of contract calls, and shields the resulting assets back into a private balance in a single transaction. Transactions from 0zk addresses can also be sent through broadcasters over Waku so they remain unlinkable to public addresses.

The main tradeoff is governance and separate compliance infrastructure. Railgun's privacy system is non-custodial, but the deployed contracts are controlled through a DAO-governed upgradeable proxy, so governance remains a trust assumption. For compliance, Private Proof of Innocence sits alongside the core contracts and lets users prove against external list providers that shielded funds are not linked to known illicit activity, without exposing private balance data.`,
    links: {
      websites: ['https://railgun.org'],
    },
    badges: [BADGES.Other.Governance],
  },
  privacyInfo: {
    trustedSetup: TRUSTED_SETUPS.Railgun,
    assets: getRailgunAssets(),
    upgradesAndGovernance: `Railgun features an omnipotent DAO governed by the stakers of RAIL token. DAO has the authority to change ZK circuit logic on the core Railgun contract, effectively arbitrarily changing the rules for shielded tokens; as well as manage blacklisted tokens, mint RAIL tokens and manage governance rewards. See docs here: <https://docs.railgun.org/wiki/rail-token/protocol-governance>

## Governance flow

1. Users stake RAIL token in the Staking contract ([0xEE6A649Aa3766bD117e12C161726b693A1B2Ee20](https://etherscan.io/address/0xEE6A649Aa3766bD117e12C161726b693A1B2Ee20)). Voting power is proportional to the staked amount and could be delegated to another address. Unstaking has ${formatSeconds(stakeLocktime)} delay.
2. Anyone can create a new proposal with an IPFS link and onchain calldata on the Voting contract ([0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC](https://etherscan.io/address/0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC)). It enters Sponsorship stage of ${formatSeconds(sponsorWindow)}, where it has to be supported by ${formatRailAmount(proposalSponsorThreshold)} stake.
3. After a ${formatSeconds(votingStartOffset)} delay, actual vote starts. "Yay" votes need to be cast within ${formatSeconds(votingYayEndOffset)}, "Nay" have ${formatSeconds(votingNayEndOffset)}. Proposal needs to reach the quorum of ${formatRailAmount(quorum)}.
4. A passed proposal (simple majority) waits for ${formatSeconds(executionStartOffset)} before execution and then must be executed within ${formatSeconds(executionEndOffset)} by anyone. Execution goes via the Delegator smart contract ([0xB6d513f6222Ee92Fff975E901bd792E2513fB53B](https://etherscan.io/address/0xB6d513f6222Ee92Fff975E901bd792E2513fB53B)), which actually has permissions to modify the Railgun protocol values.`,
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}

function getRailgunAssets(): ProjectPrivacyAsset[] {
  const railgunCore = discovery.getContract('RailgunCore')
  const sinceBlock = railgunCore.sinceBlock ?? 0

  const assets: ProjectPrivacyAsset[] = TRACKED_TOKENS.map((token) => {
    const tokenInfo = TICKERS[token]

    if (!tokenInfo) {
      throw new Error(`Missing ticker metadata for Railgun token: ${token}`)
    }

    return {
      asset: {
        address: EthereumAddress(token),
        symbol: tokenInfo.ticker,
      },
      buckets: [
        {
          id: `railgun-${tokenInfo.ticker}`,
          type: 'pool',
          label: tokenInfo.ticker,
          address: railgunCore.address,
          totalValue: {
            type: 'erc20BalanceOf',
            chain: 'ethereum',
            tokenAddress: ChainSpecificAddress.fromLong('ethereum', token),
            holder: railgunCore.address,
          },
          flows: {
            sinceBlock,
            deposit: {
              chain: 'ethereum',
              event: RAILGUN_SHIELD_EVENT,
              address: railgunCore.address,
              extractor: 'railgunShield',
              params: {
                tokenAddress: EthereumAddress(token),
              },
            },
            withdrawal: {
              chain: 'ethereum',
              event: RAILGUN_UNSHIELD_EVENT,
              address: railgunCore.address,
              extractor: 'railgunUnshield',
              params: {
                tokenAddress: EthereumAddress(token),
              },
            },
          },
        },
      ],
    }
  })

  return assets.sort((a, b) =>
    (a.asset.symbol ?? '').localeCompare(b.asset.symbol ?? '', undefined, {
      numeric: true,
    }),
  )
}
