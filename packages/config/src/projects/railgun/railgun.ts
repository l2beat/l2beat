import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  formatLargeNumber,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
import type { BaseProject, ProjectPrivacyToken } from '../../types'

const discovery = new ProjectDiscovery('railgun')

const RAILGUN_DEPOSIT_EVENT =
  '0x3a5b9dc26075a3801a6ddccf95fec485bb7500a91b44cec1add984c21ee6db3b'
const RAILGUN_WITHDRAWAL_EVENT =
  '0xd93cf895c7d5b2cd7dc7a098b678b3089f37d91f48d9b83a0800a91cbdf05284'

const TRACKED_TOKENS = [
  { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH' },
  { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT' },
  { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC' },
  { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI' },
  { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC' },
  { address: '0x85F17Cf997934a597031b2E18a9aB6ebD4B9f6a4', symbol: 'NEAR' },
  { address: '0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb', symbol: 'FLUID' },
]

const railgunCore = discovery.getContract('RailgunSmartWallet')
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

const privacyTokens: ProjectPrivacyToken[] = TRACKED_TOKENS.map((token) => {
  const resolved = getTokenByAddress(token.address)
  assert(resolved, `Unknown token ${token.address}`)

  return {
    token: {
      address: EthereumAddress(token.address),
      iconUrl: resolved.iconUrl,
      symbol: resolved.symbol,
      decimals: resolved.decimals,
      priceId: resolved.coingeckoId,
      sinceTimestamp: resolved.coingeckoListingTimestamp,
    },
    buckets: [
      {
        id: `railgun-${resolved.symbol}`,
        type: 'pool',
        label: resolved.symbol,
        address: railgunCore.address,
        sinceTimestamp: Math.max(
          railgunCore.sinceTimestamp ?? 0,
          resolved.coingeckoListingTimestamp,
        ),
        deposit: {
          event: RAILGUN_DEPOSIT_EVENT,
          extractor: 'railgunShield',
          params: {
            tokenAddress: EthereumAddress(token.address),
          },
        },
        withdrawal: {
          event: RAILGUN_WITHDRAWAL_EVENT,
          extractor: 'railgunUnshield',
          params: {
            tokenAddress: EthereumAddress(token.address),
          },
        },
      },
    ],
  }
})

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
    detailedDescription: `Railgun is a non-custodial privacy protocol on Ethereum built around encrypted UTXO-style private balances rather than fixed-denomination pools. This design enables interactions, like transfers of shielded tokens and interactions with DeFi smart contracts.

A shield transaction moves assets from a public address into the Railgun contract and creates encrypted commitments in a Merkle-tree state. Later private transfers or unshields use zk-SNARK proofs to spend those commitments without revealing the sender, recipient, token type, or amount. Notes created by deposits and private transactions represents ownership of tokens in Railgun, users must keep them secret and make sure the notes are not lost.

Railgun supports private transfers and cross-contract interactions without fragmenting liquidity across denominations. External DeFi calls are executed through the Relay Adapt flow, which temporarily unshields tokens into an adapter contract, performs a sequence of contract calls, and shields the resulting assets back into a private balance in a single transaction.

Railgun has a DAO governed by holders of RAIL token. DAO has authority to arbitrarily change the logic for shielded tokens.

### Privacy considerations

Railgun protocol supports [relayed withdrawals](https://docs.railgun.org/developer-guide/wallet/transactions/unshielding), in which relayer processes withdrawals on user's behalf for a fee, which enables sending funds to fresh addresses. Transactions from private addresses can be sent through broadcasters over [Waku network](https://blog.waku.org/2024-04-26-railgun-case-study/), which increases network-level privacy. Railgun allows interactions between shielded tokens and DeFi, which allows depositing and withdrawing different tokens.

Practical privacy also depends on the timing and amounts of deposits and withdrawals, as well as RPC providers used to send transactions and query public blockchain state. Users are advised to research the best OPSEC practices.

### Compliance

Railgun protocol does not enforce any compliance measures. However it allows using [Private Proof of Innocence](https://docs.railgun.org/wiki/assurance/private-proofs-of-innocence), which can attest to the origin and history of shielded tokens. Practically, broadcasters and some wallets only process transactions with valid PPoI.

Additionally, Railgun users can share a read-only viewing key to expose all sent and received private transactions, if required by a regulator or enforcer. 
### Anonymity set

Because Railgun allows private transfers and interactions with DeFi, anonymity set is not well defined. A withdrawal from Railgun could be connected with a deposit of another token, or could even not correspond to any deposit if a user received a private transfer from another user. The anonymity set roughly corresponds to the set of all Railgun users.`,
    links: {
      websites: ['https://railgun.org'],
    },
    badges: [
      BADGES.Privacy.Compliance,
      BADGES.Privacy.PrivateTransfers,
      BADGES.Privacy.SmartContractInteractions,
      BADGES.Other.Governance,
    ],
  },
  escrows: TRACKED_TOKENS.map((token) => ({
    address: ChainSpecificAddress.address(railgunCore.address),
    chain: ChainSpecificAddress.longChain(railgunCore.address),
    sinceTimestamp: railgunCore.sinceTimestamp ?? 0,
    tokens: [token.symbol],
  })),
  tvsInfo: {
    associatedTokens: [],
    warnings: [],
  },
  privacyInfo: {
    trustedSetup: TRUSTED_SETUPS.Railgun,
    tokens: privacyTokens,
    attributes: [
      PRIVACY_ATTRIBUTES.upgradeable,
      PRIVACY_ATTRIBUTES.optCompliance,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.defi,
      PRIVACY_ATTRIBUTES.anyAmount,
      PRIVACY_ATTRIBUTES.openSource,
    ],
    riskSummary: `## Funds can be lost if
1. the zk proof system is broken, allowing invalid spends or withdrawals.
2. the [trusted setup](#trusted-setups) is compromised or all ceremony participants collude, allowing invalid spends or withdrawals.
3. a user loses the private keys required to control their private balance.
4. the DAO passes a malicious [upgrade](#upgrades-and-governance) and users do not react before the 7-day execution delay expires.
<br>
## Privacy can be lost if
1. no broadcaster is available and transactions must be sent from a public address that can be linked to the user.`,
    upgradesAndGovernance: `Railgun features an omnipotent DAO governed by the stakers of RAIL token. DAO has the authority to change ZK circuit logic on the core Railgun contract, effectively arbitrarily changing the rules for shielded tokens; as well as manage blacklisted tokens, mint RAIL tokens and manage governance rewards. See docs here: <https://docs.railgun.org/wiki/rail-token/protocol-governance>

## Governance flow

1. Users stake RAIL token in the Staking contract ([0xEE6A649Aa3766bD117e12C161726b693A1B2Ee20](https://etherscan.io/address/0xEE6A649Aa3766bD117e12C161726b693A1B2Ee20)). Voting power is proportional to the staked amount and could be delegated to another address. Unstaking has ${formatSeconds(stakeLocktime)} delay.
2. Anyone can create a new proposal with an IPFS link and onchain calldata on the Voting contract ([0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC](https://etherscan.io/address/0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC)). It enters Sponsorship stage of ${formatSeconds(sponsorWindow)}, where it has to be supported by ${formatLargeNumber(Number(proposalSponsorThreshold / 10n ** 18n))} RAIL stake.
3. After a ${formatSeconds(votingStartOffset)} delay, actual vote starts. "Yay" votes need to be cast within ${formatSeconds(votingYayEndOffset)}, "Nay" have ${formatSeconds(votingNayEndOffset)}. Proposal needs to reach the quorum of ${formatLargeNumber(Number(quorum / 10n ** 18n))} RAIL.
4. A passed proposal (simple majority) waits for ${formatSeconds(executionStartOffset)} before execution and then must be executed within ${formatSeconds(executionEndOffset)} by anyone. Execution goes via the Delegator smart contract ([0xB6d513f6222Ee92Fff975E901bd792E2513fB53B](https://etherscan.io/address/0xB6d513f6222Ee92Fff975E901bd792E2513fB53B)), which actually has permissions to modify the Railgun protocol values.`,
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
