import { EthereumAddress, UnixTime, formatSeconds } from '@l2beat/shared-pure'

import { MILESTONES, NUGGETS, RISK_VIEW, UPGRADE_MECHANISM } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import {
  DEFAULT_OTHER_CONSIDERATIONS,
  orbitStackL2,
} from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('nova')
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
  'L1ArbitrumTimelock',
  'getMinDelay',
)
const l2TimelockDelay = 259200 // 3 days, got from https://arbiscan.io/address/0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0#readProxyContract
const totalDelay = l1TimelockDelay + challengeWindowSeconds + l2TimelockDelay

const upgradeExecutorUpgradeability = {
  upgradableBy: ['SecurityCouncil', 'L1ArbitrumTimelock'],
  upgradeDelay: `${formatSeconds(
    totalDelay,
  )} or 0 if overridden by Security Council`,
  upgradeConsiderations:
    'An upgrade initiated by the DAO can be vetoed by the Security Council.',
}

const maxTimeVariation = discovery.getContractValue<number[]>(
  'SequencerInbox',
  'maxTimeVariation',
)
const selfSequencingDelay = maxTimeVariation[2]

export const nova: Layer2 = orbitStackL2({
  badges: [Badge.VM.EVM, Badge.Stack.Orbit],
  discovery,
  associatedTokens: ['ARB'],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  display: {
    name: 'Arbitrum Nova',
    slug: 'nova',
    description:
      'Arbitrum Nova is an AnyTrust Optimium, differing from Arbitrum One by not posting transaction data onchain.',
    purposes: ['Universal'],
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
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://nova.arbitrum.io/rpc',
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'SecurityCouncil',
      'The admin of all contracts in the system, capable of issuing upgrades without notice and delay. This allows it to censor transactions, upgrade bridge implementation potentially gaining access to all funds stored in a bridge and change the sequencer or any other system component (unlimited upgrade power). It is also the admin of the special purpose smart contracts used by validators.',
      [
        {
          text: 'Security Council members - Arbitrum DAO Governance Docs',
          href: 'https://docs.arbitrum.foundation/foundational-documents/transparency-report-initial-foundation-setup',
        },
      ],
    ),
    ...discovery.getMultisigPermission(
      'BatchPosterManagerMultisig',
      'It can update whether an address is authorized to be a batch poster at the sequencer inbox. The UpgradeExecutor retains the ability to update the batch poster manager (along with any batch posters).',
    ),
    discovery.contractAsPermissioned(
      discovery.getContract('L1ArbitrumTimelock'),
      'It gives the DAO participants on the L2 the ability to upgrade the system. Only the L2 counterpart of this contract can execute the upgrades.',
    ),
  ],
  nonTemplateContracts: [
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
        'Main entry point for the Sequencer submitting transaction batches to a Rollup.',
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
        "This contract can upgrade the system's contracts. The upgrades can be done either by the Security Council or by the L1ArbitrumTimelock.",
      ...upgradeExecutorUpgradeability,
    }),
    discovery.getContractDetails('L1ArbitrumTimelock', {
      description:
        'Timelock contract for Arbitrum DAO Governance. It gives the DAO participants the ability to upgrade the system. Only the L2 counterpart of this contract can execute the upgrades.',
      ...upgradeExecutorUpgradeability,
    }),
    discovery.getContractDetails('L1GatewayRouter', {
      description: 'Router managing token <--> gateway mapping.',
      ...upgradeExecutorUpgradeability,
    }),
    discovery.getContractDetails('ChallengeManager', {
      description:
        'Contract that allows challenging invalid state roots. Can be called through the RollupProxy.',
      ...upgradeExecutorUpgradeability,
    }),
  ],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0xA2e996f0cb33575FA0E36e8f62fCd4a9b897aAd3'),
      sinceTimestamp: new UnixTime(1659620187),
      tokens: ['DAI'],
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
  ],
  nonTemplateRiskView: {
    exitWindow: {
      ...RISK_VIEW.EXIT_WINDOW(l2TimelockDelay, selfSequencingDelay, 0),
      sentiment: 'bad',
      description: `Upgrades are initiated on L2 and have to go first through a ${formatSeconds(
        l2TimelockDelay,
      )} delay. Since there is a ${formatSeconds(
        selfSequencingDelay,
      )} to force a tx, users have only ${formatSeconds(
        l2TimelockDelay - selfSequencingDelay,
      )} to exit.\nIf users post a tx after that time, they would need to self propose a root with a ${formatSeconds(
        validatorAfkTime,
      )} delay and then wait for the ${formatSeconds(
        challengeWindowSeconds,
      )} challenge window, while the upgrade would be confirmed just after the ${formatSeconds(
        challengeWindowSeconds,
      )} challenge window and the ${formatSeconds(
        l1TimelockDelay,
      )} L1 timelock.`,
      warning: {
        value: 'The Security Council can upgrade with no delay.',
        sentiment: 'bad',
      },
    },
  },
  nonTemplateTechnology: {
    otherConsiderations: [
      ...DEFAULT_OTHER_CONSIDERATIONS,
      UPGRADE_MECHANISM.ARBITRUM_DAO(
        l1TimelockDelay,
        challengeWindow * assumedBlockTime,
        l2TimelockDelay,
      ),
    ],
  },
  milestones: [
    {
      ...MILESTONES.MAINNET_OPEN,
      date: '2022-08-09T00:00:00Z',
      link: 'https://medium.com/offchainlabs/its-time-for-a-new-dawn-nova-is-open-to-the-public-a081df1e4ad2',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Data availability on Arbitrum Nova',
      url: 'https://twitter.com/bkiepuszewski/status/1555180043525128200',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
  ],
})
