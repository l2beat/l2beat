import { EthereumAddress, UnixTime, formatSeconds } from '@l2beat/shared-pure'
import { NUGGETS, RISK_VIEW, UPGRADE_MECHANISM } from '../../common'
import { ESCROW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import {
  DaEconomicSecurityRisk,
  DaRelayerFailureRisk,
  DaUpgradeabilityRisk,
} from '../da-beat/common'
import { DAC } from '../da-beat/templates/dac-template'
import {
  WASMVM_OTHER_CONSIDERATIONS,
  getNitroGovernance,
  orbitStackL2,
} from './templates/orbitStack'

const discovery = new ProjectDiscovery('nova')
const l2Discovery = new ProjectDiscovery('nova', 'nova')
const discovery_arbitrum = new ProjectDiscovery('arbitrum', 'arbitrum') // needed for governance section

const assumedBlockTime = 12 // seconds, different from RollupUserLogic.sol#L35 which assumes 13.2 seconds
const validatorAfkBlocks = discovery.getContractValue<number>(
  'RollupProxy',
  'VALIDATOR_AFK_BLOCKS',
)
const validatorAfkTime = validatorAfkBlocks * assumedBlockTime
const challengeWindow = discovery.getContractValue<number>(
  'RollupProxy',
  'confirmPeriodBlocks',
)
const challengeWindowSeconds = challengeWindow * assumedBlockTime
const l1TimelockDelay = discovery.getContractValue<number>(
  'L1Timelock',
  'getMinDelay',
)
const l2TimelockDelay = 259200 // 3 days, got from https://arbiscan.io/address/0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0#readProxyContract
const totalDelay = l1TimelockDelay + challengeWindowSeconds + l2TimelockDelay

const dac = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')
const { membersCount, requiredSignatures } = dac

const upgradeExecutorUpgradeability = {
  upgradableBy: ['SecurityCouncil', 'L1Timelock'],
  upgradeDelay: `${formatSeconds(
    totalDelay,
  )} or 0 if overridden by Security Council`,
  upgradeConsiderations:
    'An upgrade initiated by the DAO can be vetoed by the Security Council.',
}
const l2Upgradability = {
  // same as on L1, but messages from L1 must be sent to L2
  upgradableBy: ['L2SecurityCouncilEmergency', 'L1Timelock'],
  upgradeDelay: `${formatSeconds(
    totalDelay,
  )} or 0 if overridden by the Security Council`,
  upgradeConsiderations:
    'An upgrade initiated by the DAO can be vetoed by the Security Council.',
}

const treasuryTimelockDelay = discovery_arbitrum.getContractValue<number>(
  'TreasuryTimelock',
  'getMinDelay',
)

const l2CoreQuorumPercent =
  (discovery_arbitrum.getContractValue<number>(
    'CoreGovernor',
    'quorumNumerator',
  ) /
    discovery_arbitrum.getContractValue<number>(
      'CoreGovernor',
      'quorumDenominator',
    )) *
  100
const l2TreasuryQuorumPercent =
  (discovery_arbitrum.getContractValue<number>(
    'TreasuryGovernor',
    'quorumNumerator',
  ) /
    discovery_arbitrum.getContractValue<number>(
      'TreasuryGovernor',
      'quorumDenominator',
    )) *
  100

const maxTimeVariation = discovery.getContractValue<{
  delayBlocks: number
  futureBlocks: number
  delaySeconds: number
  futureSeconds: number
}>('SequencerInbox', 'maxTimeVariation')

const selfSequencingDelay = maxTimeVariation.delaySeconds

export const nova: Layer2 = orbitStackL2({
  addedAt: new UnixTime(1623153328), // 2021-06-08T11:55:28Z
  additionalBadges: [
    Badge.VM.WasmVM,
    Badge.DA.DAC,
    Badge.Stack.Nitro,
    Badge.Other.Governance,
    Badge.Other.L3HostChain,
  ],
  discovery,
  hasAtLeastFiveExternalChallengers: true,
  associatedTokens: ['ARB'],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  display: {
    name: 'Arbitrum Nova',
    slug: 'nova',
    description:
      'Arbitrum Nova is an AnyTrust Optimium, differing from Arbitrum One by not posting transaction data onchain.',
    links: {
      websites: [
        'https://nova.arbitrum.io/',
        'https://arbitrum.io/',
        'https://arbitrum.foundation/',
      ],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=arbitrum-nova&sourceChain=ethereum',
      ],
      documentation: [
        'https://developer.arbitrum.io/',
        'https://developer.arbitrum.io/inside-arbitrum-nitro/#inside-anytrust',
      ],
      explorers: [
        'https://nova.arbiscan.io/',
        'https://nova-explorer.arbitrum.io/',
      ],
      repositories: [
        'https://github.com/ArbitrumFoundation/docs',
        'https://github.com/ArbitrumFoundation/governance',
        'https://github.com/OffchainLabs/nitro',
      ],
      socialMedia: [
        'https://twitter.com/arbitrum',
        'https://arbitrumfoundation.medium.com/',
        'https://discord.gg/Arbitrum',
      ],
    },
  },
  chainConfig: {
    name: 'nova',
    chainId: 42170,
    explorerUrl: 'https://nova.arbiscan.io',
    explorerApi: {
      url: 'https://api-nova.arbiscan.io/api',
      type: 'etherscan',
    },
    minTimestampForTvl: new UnixTime(1656122488),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 1746963,
        version: '3',
      },
    ],
    coingeckoPlatform: 'arbitrum-nova',
  },
  rpcUrl: 'https://nova.arbitrum.io/rpc',
  upgradesAndGovernance: getNitroGovernance(
    l2CoreQuorumPercent,
    l2TimelockDelay,
    challengeWindowSeconds,
    l1TimelockDelay,
    treasuryTimelockDelay,
    l2TreasuryQuorumPercent,
  ),
  nonTemplatePermissions: {
    [discovery.chain]: {
      actors: [
        ...discovery.getMultisigPermission(
          'SecurityCouncil',
          'The admin of all contracts in the system, capable of issuing upgrades without notice and delay. This allows it to censor transactions, upgrade bridge implementation potentially gaining access to all funds stored in a bridge and change the sequencer or any other system component (unlimited upgrade power). It is also the admin of the special purpose smart contracts used by validators.',
          [
            {
              title: 'Security Council members - Arbitrum DAO Governance Docs',
              url: 'https://docs.arbitrum.foundation/foundational-documents/transparency-report-initial-foundation-setup',
            },
          ],
        ),
        discovery.contractAsPermissioned(
          discovery.getContract('L1Timelock'),
          'Timelock contract for Arbitrum Governance transactions. Scheduled transactions from Arbitrum One L2 (by the DAO or the Security Council) are delayed here and can be canceled by the Security Council or executed to upgrade and change system contracts on Ethereum, Arbitrum One and -Nova.',
        ),
        ...discovery.getMultisigPermission(
          'BatchPosterManagerMultisig',
          'It can update whether an address is authorized to be a batch poster at the sequencer inbox. The UpgradeExecutor retains the ability to update the batch poster manager (along with any batch posters).',
        ),
        discovery.contractAsPermissioned(
          discovery.getContract('UpgradeExecutor'),
          'The UpgradeExecutor can change the Committee members by updating the valid keyset.',
        ),
      ],
    },
    nova: {
      actors: [
        ...l2Discovery.getMultisigPermission(
          'L2SecurityCouncilEmergency',
          'The elected signers for the Arbitrum SecurityCouncil can act through this multisig on Layer2, permissioned to upgrade all system contracts without delay.',
        ),
        l2Discovery.eoaAsPermissioned(
          l2Discovery.getEOA('L1Timelock'),
          'Alias of the L1Timelock contract on L1.',
        ),
      ],
    },
  },
  nonTemplateContracts: {
    [discovery.chain]: [
      discovery.getContractDetails('RollupProxy', {
        description:
          'Main contract implementing Arbitrum One Rollup. Manages other Rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.',
        ...upgradeExecutorUpgradeability,
      }),
      discovery.getContractDetails('Bridge', {
        description:
          'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
        ...upgradeExecutorUpgradeability,
      }),
      discovery.getContractDetails('SequencerInbox', {
        description:
          'Main entry point for the Sequencer submitting transaction batches to a Rollup. Sequencers can be changed here through the UpgradeExecutor or the BatchPosterManager.',
        ...upgradeExecutorUpgradeability,
      }),
      discovery.getContractDetails('Inbox', {
        description:
          'Entry point for users depositing ETH and sending L1 --> L2 messages. Deposited ETH is escrowed in a Bridge contract.',
        ...upgradeExecutorUpgradeability,
      }),
      discovery.getContractFromValue('RollupProxy', 'outbox', {
        description:
          "Arbitrum's Outbox system allows for arbitrary L2 to L1 contract calls; i.e., messages initiated from L2 which eventually resolve in execution on L1.",
        ...upgradeExecutorUpgradeability,
      }),
      discovery.getContractDetails('UpgradeExecutor', {
        description:
          "This contract can upgrade the system's contracts. The upgrades can be done either by the Security Council or by the L1Timelock.",
        ...upgradeExecutorUpgradeability,
      }),
      discovery.getContractDetails('L1Timelock', {
        description:
          'Timelock contract for Arbitrum Governance transactions. Scheduled transactions from Arbitrum One L2 (by the DAO or the Security Council) are delayed here and can be canceled by the Security Council or executed to upgrade and change system contracts on Ethereum, Arbitrum One and -Nova.',
        ...upgradeExecutorUpgradeability,
      }),
      discovery.getContractDetails('L1GatewayRouter', {
        description: 'Router managing token <--> gateway mapping.',
        ...upgradeExecutorUpgradeability,
      }),
      discovery.getContractDetails('ChallengeManager', {
        description:
          'Contract that allows challenging invalid state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.',
        ...upgradeExecutorUpgradeability,
      }),
    ],
    nova: [
      l2Discovery.getContractDetails('L2UpgradeExecutor', {
        description:
          "This contract can upgrade the L2 system's contracts through the L2ProxyAdmin. The upgrades can be done either by the Security Council or by the L1Timelock (via its alias on L2).",
        ...l2Upgradability,
      }),
      l2Discovery.getContractDetails('L2ProxyAdmin', {
        description:
          "The owner (UpgradeExecutor) can upgrade proxies' implementations of all L2 system contracts through this contract.",
      }),
      l2Discovery.getContractDetails('L2GatewaysProxyAdmin', {
        description:
          "The owner (UpgradeExecutor) can upgrade proxies' implementations of all L2 bridging gateway contracts through this contract.",
      }),
      l2Discovery.getContractDetails('L2BaseFee', {
        description:
          'This contract receives all BaseFees: The transaction fee component that covers the minimum cost of Arbitrum transaction execution. They are withdrawable to a configurable set of recipients.',
      }),
      l2Discovery.getContractDetails('L2SurplusFee', {
        description:
          'This contract receives all SurplusFees: Transaction fee component that covers the cost beyond that covered by the L2 Base Fee during chain congestion. They are withdrawable to a configurable set of recipients.',
      }),
      l2Discovery.getContractDetails('ArbChildToParentRewardRouter', {
        description:
          'Is used as the main recipient for the ETH from L2SurplusFee and L2BaseFee contracts. Forwards the ETH via L1 to the Arbitrum treasury on Arbitrum One.',
      }),
      l2Discovery.getContractDetails('L2ArbitrumToken', {
        description:
          'The ARB token contract. Supply can be increased by the owner once per year by a maximum of 2%.',
        ...l2Upgradability,
      }),
      l2Discovery.getContractDetails('L2GatewayRouter', {
        description: 'Router managing token <--> gateway mapping on L2.',
        ...l2Upgradability,
      }),
      l2Discovery.getContractDetails('L2ERC20Gateway', {
        description:
          'Counterpart to the L1ERC20Gateway. Can mint (deposit to L2) and burn (withdraw to L1) ERC20 tokens on L2.',
        ...l2Upgradability,
      }),
      l2Discovery.getContractDetails('L2WethGateway', {
        description:
          'Counterpart to the Bridge on L1. Mints and burns WETH on L2.',
        ...l2Upgradability,
      }),
      l2Discovery.getContractDetails('L2ARBGateway', {
        description:
          'ARB sent from L2 to L1 is escrowed in this contract and minted on L1.',
        ...l2Upgradability,
      }),
    ],
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0xA2e996f0cb33575FA0E36e8f62fCd4a9b897aAd3'),
      sinceTimestamp: new UnixTime(1659620187),
      tokens: ['DAI'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'DAI Vault for custom DAI Gateway. Fully controlled by MakerDAO governance.',
      ...upgradeExecutorUpgradeability,
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf'),
      sinceTimestamp: new UnixTime(1656305583),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, “wrapped” token will be minted.',
      ...upgradeExecutorUpgradeability,
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x23122da8C581AA7E0d07A36Ff1f16F799650232f'),
      sinceTimestamp: new UnixTime(1659620187),
      tokens: '*',
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'Main entry point for users depositing ERC20 tokens that require minting a custom token on the L2.',
      ...upgradeExecutorUpgradeability,
    }),
  ],
  nonTemplateRiskView: {
    exitWindow: RISK_VIEW.EXIT_WINDOW_NITRO(
      l2TimelockDelay,
      selfSequencingDelay,
      challengeWindowSeconds,
      validatorAfkTime,
      l1TimelockDelay,
    ),
  },
  nonTemplateTechnology: {
    otherConsiderations: [
      ...WASMVM_OTHER_CONSIDERATIONS,
      UPGRADE_MECHANISM.ARBITRUM_DAO(
        l1TimelockDelay,
        challengeWindow * assumedBlockTime,
        l2TimelockDelay,
      ),
    ],
  },
  milestones: [
    {
      title: 'ArbOS 32 Emergency upgrade',
      url: 'https://github.com/OffchainLabs/nitro/releases/tag/v3.2.0',
      date: '2024-09-25T00:00:00Z',
      description:
        'SecurityCouncil emergency upgrades to fix attack vectors related to Stylus resource pricing.',
      type: 'incident',
    },
    {
      title: 'ArbOS 31 Bianca upgrade',
      url: 'https://www.tally.xyz/gov/arbitrum/proposal/108288822474129076868455956066667369439381709547570289793612729242368710728616',
      date: '2024-09-03T00:00:00Z',
      description:
        'Nova upgrades to ArbOS 31 activating Stylus (new languages for smart contracts).',
      type: 'general',
    },
    {
      title: 'Mainnet for everyone',
      description:
        'Whitelist got removed, there are no restrictions on who can transact with the network.',
      date: '2022-08-09T00:00:00Z',
      url: 'https://medium.com/offchainlabs/its-time-for-a-new-dawn-nova-is-open-to-the-public-a081df1e4ad2',
      type: 'general',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Data availability on Arbitrum Nova',
      url: 'https://twitter.com/bkiepuszewski/status/1555180043525128200',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
  ],
  customDa: DAC({
    technology: {
      description: `
## Architecture
![Nova architecture](/images/da-layer-technology/nova/architecture.png#center)

Nova is a data availability solution for Arbitrum rollups built on the AnyTrust protocol. It is composed of the following components:
- **Sequencer Inbox**: Main entry point for the Sequencer submitting transaction batches.
- **Data Availability Committee (DAC)**: A group of members responsible for storing and providing data on demand.
- **Data Availability Certificate (DACert)**: A commitment ensuring that data blobs are available without needing full data posting on the L1 chain. 

Committee members run servers that support APIs for storing and retrieving data blobs. 
The Sequencer API allows the rollup Sequencer to submit data blobs for storage, while the REST API enables anyone to fetch data by hash. 
When the Sequencer produces a data batch, it sends the batch along with an expiration time to Committee members, who store it and sign it. 
Once enough signatures are collected, the Sequencer aggregates them into a valid DACert and posts it to the L1 chain inbox. 
If the Sequencer fails to collect enough signatures, it falls back to posting the full data to the L1 chain. \n

A DACert includes a hash of the data block, an expiration time, and proof that the required threshold of Committee members have signed off on the data. 
The proof consists of a hash of the Keyset used in signing, a bitmap indicating which members signed, and a BLS aggregated signature. 
L2 nodes reading from the sequencer inbox verify the certificate’s validity by checking the number of signers, the aggregated signature, and that the expiration time is at least two weeks ahead of the L2 timestamp. 
If the DACert is valid, it provides a proof that the corresponding data is available from honest committee members.

## DA Bridge Architecture
![Nova bridge architecture](/images/da-bridge-technology/nova/architecture.png#center)

In Nova architecture, the DA commitments are posted to the L1 through the sequencer inbox, using the inbox as a DA bridge.
The DA commitment consists of Data Availability Certificate (DACert), including a hash of the data block, an expiration time, and a proof that the required threshold of Committee members have signed off on the data.
The sequencer distributes the data and collects signatures from Committee members offchain. Only the DACert is posted by the sequencer to the L1 chain inbox (the DA bridge), achieving L2 transaction ordering finality in a single onchain transaction.

## DA Bridge Upgradeability
![Nova bridge architecture](/images/upgrades-and-governance/nova.png#center)

The Arbitrum DAO controls Arbitrum Nova through upgrades and modifications to their smart contracts on Layer 1 Ethereum and the Layer 2s. 
Regular upgrades, Admin- and Owner actions originate from either the Arbitrum DAO or the non-emergency (proposer-) Security Council on Arbitrum One and pass through multiple delays and timelocks before being executed at their destination. Contrarily, the three Emergency Security Council multisigs (one on each chain: Arbitrum One, Ethereum, Arbitrum Nova) can skip delays and directly access all admin- and upgrade functions of all smart contracts. These two general paths have the same destination: the respective UpgradeExecutor smart contract.
Regular upgrades are scheduled in the L2 Timelock. The proposer Security Council can do this directly and the Arbitrum DAO (ARB token holders and delegates) must meet a CoreGovernor-enforced 5% threshold of the votable tokens. The L2 Timelock queues the transaction for a 3d delay and then sends it to the Outbox contract on Ethereum. This incurs another delay (the challenge period) of 6d 8h. When that has passed, the L1 Timelock delays for additional 3d. Both timelocks serve as delays during which the transparent transaction contents can be audited, and even cancelled by the Emergency Security Council. Finally, the transaction can be executed, calling Admin- or Owner functions of the respective destination smart contracts through the UpgradeExecutor on Ethereum. If the predefined transaction destination is Arbitrum One or -Nova, this last call is executed on L2 through the canonical bridge and the aliased address of the L1 Timelock.
Operator roles like the Sequencers and Validators are managed using the same paths. Sequencer changes can be delegated to a Batch Poster Manager.
`,
    },
    dac: {
      requiredMembers: requiredSignatures,
      membersCount: membersCount,
      knownMembers: [
        {
          external: true,
          name: 'ConsenSys Software Inc.',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
        {
          external: true,
          name: 'QuickNode, Inc.',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
        {
          external: true,
          name: 'P2P.org',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
        {
          external: true,
          name: 'Google Cloud',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
        {
          external: false,
          name: 'Offchain Labs, Inc.',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
        {
          external: true,
          name: 'Opensea Innovation Labs Private Limited',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
      ],
    },
    risks: {
      upgradeability: DaUpgradeabilityRisk.SecurityCouncil(totalDelay),
      economicSecurity: DaEconomicSecurityRisk.OffChainVerifiable,
      relayerFailure: DaRelayerFailureRisk.Governance(totalDelay),
    },
  }),
})
