import {
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('zklinknova')

const optimismUpgradability = {
  upgradableBy: [{ name: 'OptimismOwner', delay: 'no' }],
}

const arbitrumUpgradability = {
  upgradableBy: [{ name: 'ArbitrumOwner', delay: 'no' }],
}

const baseUpgradability = {
  upgradableBy: [{ name: 'BaseOwner', delay: 'no' }],
}

const mantapacificUpgradability = {
  upgradableBy: [{ name: 'MantaOwner', delay: 'no' }],
}

const mantleUpgradability = {
  upgradableBy: [{ name: 'MantleOwner', delay: 'no' }],
}

const scrollUpgradability = {
  upgradableBy: [{ name: 'ScrollOwner', delay: 'no' }],
}

const blastUpgradability = {
  upgradableBy: [{ name: 'BlastOwner', delay: 'no' }],
}

const zksync2Upgradability = {
  upgradableBy: [{ name: 'EraOwner', delay: 'no' }],
}

const ethereumUpgradability = {
  upgradableBy: [{ name: 'EthereumOwner', delay: 'no' }],
}

const lineaUpgradability = {
  upgradableBy: [{ name: 'LineaOwner', delay: 'no' }],
}

const executionDelaySeconds = discovery.getContractValue<number>(
  'ValidatorTimelock',
  'executionDelay',
)

const upgradeDelaySeconds = discovery.getContractValue<number>(
  'Governance',
  'minDelay',
)

const chainId = 810180

export const zklinknova: ScalingProject = {
  type: 'layer3',
  id: ProjectId('zklinknova'),
  capability: 'universal',
  addedAt: UnixTime(1705330478), // 2024-01-15T14:54:38Z
  hostChain: ProjectId('linea'),
  badges: [BADGES.VM.EVM, BADGES.DA.DAC, BADGES.L3ParentChain.Linea],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  display: {
    name: 'zkLink Nova',
    slug: 'zklinknova',
    description:
      'zkLink Nova is a Layer 3 zkEVM Validium network leveraging ZK Stack that allows for scattered assets across Ethereum Layer 2s to be aggregated for interoperable trade and transactions.',
    purposes: ['Universal', 'Interoperability'],
    links: {
      websites: ['https://zklink.io', 'https://zk.link'],
      bridges: [
        'https://portal.zklink.io',
        'https://zklink.io/merge',
        'https://app.zklink.io',
      ],
      documentation: ['https://docs.zklink.io'],
      explorers: ['https://explorer.zklink.io'],
      repositories: ['https://github.com/zkLinkProtocol'],
      socialMedia: [
        'https://blog.zk.link',
        'https://x.com/zkLink_Official',
        'https://discord.gg/zklink',
        'https://t.me/zkLinkorg',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
    zkCatalogId: ProjectId('boojum'),
  },
  chainConfig: {
    name: 'zklinknova',
    chainId,
    explorerUrl: 'https://explorer.zklink.io',
    sinceTimestamp: UnixTime(1709273393),
    apis: [
      { type: 'etherscan', chainId },
      { type: 'rpc', url: 'https://rpc.zklink.io', callsPerMinute: 300 },
    ],
  },
  config: {
    activityConfig: { type: 'block', startBlock: 1 },
    associatedTokens: ['ZKL'],
    escrows: [
      {
        chain: 'optimism',
        includeInTotal: false,
        address: EthereumAddress('0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b'),
        sinceTimestamp: UnixTime(1711092485),
        tokens: ['ETH'],
        source: 'external',
        bridgedUsing: {
          bridges: [
            {
              name: 'zkLink Nova Bridge from Optimism',
            },
          ],
        },
      },
      {
        chain: 'optimism',
        includeInTotal: false,
        address: EthereumAddress('0x5Bd51296423A9079b931414C1De65e7057326EaA'),
        sinceTimestamp: UnixTime(1711095511),
        tokens: '*',
        source: 'external',
        bridgedUsing: {
          bridges: [
            {
              name: 'zkLink Nova Bridge from Optimism',
            },
          ],
        },
      },
      {
        chain: 'linea',
        includeInTotal: false,
        address: EthereumAddress('0x5Cb18b6e4e6F3b46Ce646b0f4704D53724C5Df05'),
        sinceTimestamp: UnixTime(1709218085),
        tokens: ['ETH'],
      },
      {
        chain: 'linea',
        includeInTotal: false,
        address: EthereumAddress('0x62cE247f34dc316f93D3830e4Bf10959FCe630f8'),
        sinceTimestamp: UnixTime(1709218113),
        tokens: '*',
      },
      {
        chain: 'ethereum',
        includeInTotal: false,
        address: EthereumAddress('0x5fD9F73286b7E8683Bab45019C94553b93e015Cf'),
        sinceTimestamp: UnixTime(1709278799),
        tokens: ['ETH'],
        bridgedUsing: {
          bridges: [
            {
              name: 'zkLink Nova Bridge from Ethereum',
            },
          ],
        },
      },
      {
        chain: 'ethereum',
        includeInTotal: false,
        address: EthereumAddress('0xAd16eDCF7DEB7e90096A259c81269d811544B6B6'),
        sinceTimestamp: UnixTime(1709295323),
        tokens: '*',
        bridgedUsing: {
          bridges: [
            {
              name: 'zkLink Nova Bridge from Ethereum',
            },
          ],
        },
        premintedTokens: ['ZKL'],
      },
      {
        chain: 'mantapacific',
        includeInTotal: false,
        address: EthereumAddress('0xd784d7128b46b60ca7d8bdc17dcec94917455657'),
        sinceTimestamp: UnixTime(1709279099),
        tokens: ['ETH'],
        source: 'external',
        bridgedUsing: {
          bridges: [
            {
              name: 'zkLink Nova Bridge from Mantapacific',
            },
          ],
        },
      },
      {
        chain: 'mantapacific',
        includeInTotal: false,
        address: EthereumAddress('0x44a65dc12865a1e5249b45b4868f32b0e37168ff'),
        sinceTimestamp: UnixTime(1709295839),
        tokens: '*',
        source: 'external',
        bridgedUsing: {
          bridges: [
            {
              name: 'zkLink Nova Bridge from Mantapacific',
            },
          ],
        },
      },
      {
        chain: 'mantle',
        includeInTotal: false,
        address: EthereumAddress('0xD784d7128B46B60Ca7d8BdC17dCEC94917455657'),
        sinceTimestamp: UnixTime(1709279309),
        tokens: ['MNT'],
        source: 'external',
        bridgedUsing: {
          bridges: [
            {
              name: 'zkLink Nova Bridge from Mantle',
            },
          ],
        },
      },
      {
        chain: 'mantle',
        includeInTotal: false,
        address: EthereumAddress('0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2'),
        sinceTimestamp: UnixTime(1709296907),
        tokens: '*',
        source: 'external',
        bridgedUsing: {
          bridges: [
            {
              name: 'zkLink Nova Bridge from Mantle',
            },
          ],
        },
      },
      {
        chain: 'zksync2',
        includeInTotal: false,
        address: EthereumAddress('0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A'),
        sinceTimestamp: UnixTime(1709280600),
        tokens: ['ETH'],
        source: 'external',
        bridgedUsing: {
          bridges: [
            {
              name: 'zkLink Nova Bridge from ZKsync Era',
            },
          ],
        },
      },
      {
        chain: 'zksync2',
        includeInTotal: false,
        address: EthereumAddress('0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08'),
        sinceTimestamp: UnixTime(1709297040),
        tokens: '*',
        source: 'external',
        bridgedUsing: {
          bridges: [
            {
              name: 'zkLink Nova Bridge from ZKsync Era',
            },
          ],
        },
      },
      {
        chain: 'arbitrum',
        includeInTotal: false,
        address: EthereumAddress('0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A'),
        sinceTimestamp: UnixTime(1709280428),
        tokens: ['ETH'],
        source: 'external',
        bridgedUsing: {
          bridges: [
            {
              name: 'zkLink Nova Bridge from Arbitrum',
            },
          ],
        },
      },
      {
        chain: 'arbitrum',
        includeInTotal: false,
        address: EthereumAddress('0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585'),
        sinceTimestamp: UnixTime(1709296973),
        tokens: '*',
        source: 'external',
        bridgedUsing: {
          bridges: [
            {
              name: 'zkLink Nova Bridge from Arbitrum',
            },
          ],
        },
      },
      {
        chain: 'blast',
        includeInTotal: false,
        address: EthereumAddress('0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD'),
        sinceTimestamp: UnixTime(1710417729),
        tokens: ['ETH'],
        source: 'external',
        bridgedUsing: {
          bridges: [
            {
              name: 'zkLink Nova Bridge from Blast',
            },
          ],
        },
      },
      {
        chain: 'blast',
        includeInTotal: false,
        address: EthereumAddress('0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b'),
        sinceTimestamp: UnixTime(1710427013),
        tokens: '*',
        source: 'external',
        bridgedUsing: {
          bridges: [
            {
              name: 'zkLink Nova Bridge from Blast',
            },
          ],
        },
      },
      {
        chain: 'base',
        includeInTotal: false,
        address: EthereumAddress('0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd'),
        sinceTimestamp: UnixTime(1711095697),
        tokens: ['ETH'],
        source: 'external',
        bridgedUsing: {
          bridges: [
            {
              name: 'zkLink Nova Bridge from Base',
            },
          ],
        },
      },
      {
        chain: 'base',
        includeInTotal: false,
        address: EthereumAddress('0x80d12A78EfE7604F00ed07aB2f16F643301674D5'),
        sinceTimestamp: UnixTime(1711098033),
        tokens: '*',
        source: 'external',
        bridgedUsing: {
          bridges: [
            {
              name: 'zkLink Nova Bridge from Base',
            },
          ],
        },
      },
    ],
  },
  stage: { stage: 'NotApplicable' },
  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_ST_SN_WRAP,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL,
    exitWindow: RISK_VIEW.EXIT_WINDOW(
      upgradeDelaySeconds,
      executionDelaySeconds,
    ),
    sequencerFailure: RISK_VIEW.SEQUENCER_ENQUEUE_VIA('L2'),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stackedRiskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_L3('Linea'),
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_L3,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0), // TODO(donnoh): something smarter if things change. should be (min(zklink, linea), sum(zklink, linea))
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  technology: {
    dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.GENERIC_OFF_CHAIN,
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      description:
        'The validators are the only entities that can propose blocks and process transactions. Moreover, they are trusted to only relay valid messages using the fast path. Fast path messages are eventually checked against the slow path, and if they are invalid, the system halts.',
      risks: [
        ...OPERATOR.CENTRALIZED_OPERATOR.risks,
        {
          category: 'Funds can be lost if',
          text: 'the operator relays invalid messages using the fast path.',
          isCritical: true,
        },
      ],
    },
    forceTransactions: {
      name: 'Users can force any transaction via L2',
      description:
        'If a user is censored by L3 Sequencer, they can try to force transaction via L2 queue. Right now there is no mechanism that forces L3 Sequencer to include\
        transactions from L2 queue in an L3 block.',
      risks: FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM.risks,
      references: [],
    },
    exitMechanisms: [
      EXITS.REGULAR_MESSAGING('zk'),
      EXITS.FORCED_MESSAGING('forced-messages'),
    ],
    otherConsiderations: [
      {
        name: 'Bridging from multiple chains',
        description:
          'zkLink allows users to bridge assets from multiple chains, not just the base chain Linea. To do this, messages are sent through the canonical bridges of each respective chain to the main zkLink contract on Linea. To withdraw, state updates are relayed back to each chain with the respective canonical bridges. Since deposits in this way are processed quite slowly, the system allows validators to relay messages directly to the main zkLink contract in a trusted way. These messages are then checked against the slow path, and if they are invalid, the system eventually halts.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the canonical bridges of the secondary chains are compromised.',
          },
        ],
        references: [],
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.NONE,
    bridge: DA_BRIDGES.NONE,
    mode: DA_MODES.STATE_DIFFS_COMPRESSED,
  },
  contracts: {
    addresses: {
      linea: [
        discovery.getContractDetails('LineaL1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from Linea to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...lineaUpgradability,
        }),
        discovery.getContractDetails('LineazkLink', {
          description:
            'Main contract of the system where blocks are committed, proven and executed. It syncs messages from secondary chains ("slow" path) and accepts "fast" forwarded requests from permissioned validators that are later cross-checked with the slow path. ETH coming from secondary chains are transferred and escrowed here. State roots are then synced back to the secondary chains.',
          ...lineaUpgradability,
        }),
        discovery.getContractDetails('LineaL2Gateway', {
          description:
            "High level interface between the main zkLink contract and Linea's message service.",
          ...lineaUpgradability,
        }),
        discovery.getContractDetails('ValidatorTimelock', {
          description: `Intermediary contract between the one of the validators and the ZKsync Era diamond that can delay block execution (ie withdrawals and other L3 --> L2 messages). Currently, the delay is set to ${formatSeconds(
            executionDelaySeconds,
          )}.`,
        }),
        discovery.getContractDetails('Verifier', {
          description: 'Implements ZK proof verification logic.',
          ...lineaUpgradability,
        }),
        discovery.getContractDetails('Governance', {
          description: `Intermediary governance contract with two roles and a customizable delay. This delay is only mandatory for transactions scheduled by the Owner role and can be set by the SecurityCouncil role. The SecurityCouncil role can execute arbitrary upgrade transactions immediately. Currently the delay is set to ${formatSeconds(
            upgradeDelaySeconds,
          )} and the SecurityCouncil role is not used.`,
        }),
      ],
      ethereum: [
        discovery.getContractDetails('EthereumL1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from Ethereum to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...ethereumUpgradability,
        }),
        discovery.getContractDetails('EthereumzkLink', {
          description:
            "Main messaging contract on Ethereum and ETH escrow. Outgoing messages (like deposits) are sent through the EthereumL2Gateway which ultimately makes use of Ethereum's canonical messaging bridge to reach the Arbitrator on L1. Only whitelisted validators can sync messages with zkLink Nova, which also transfer the ETH to it via the respective canonical bridges. Incoming messages (like withdrawals) are validated on Linea first and then sent to this contract through the same path. Whitelisted validators can also relay messages to zkLink without going through the canonical bridge (fast path), which are later cross-checked with the slow path. If the check fails, the system halts.",
          ...ethereumUpgradability,
        }),
        discovery.getContractDetails('EthereumL1Gateway', {
          description:
            "High level interface between the local zkLink contract and Ethereum's message service.",
          ...ethereumUpgradability,
        }),
        discovery.getContractDetails('Arbitrator', {
          description:
            'Contract storing the mapping between secondary chain bridges and acts as an intermediary to receive and relay messages to and from the main zkLink contract.',
          ...ethereumUpgradability,
        }),
        discovery.getContractDetails('LineaL1Gateway', {
          description:
            'L1 counterpart receiving messages from the LineaL2Gateway on Linea. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
        discovery.getContractDetails('MantaL1Gateway', {
          description:
            'L1 counterpart receiving messages from the MantaL2Gateway on Manta Pacific. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
        discovery.getContractDetails('MantleL1Gateway', {
          description:
            'L1 counterpart receiving messages from the MantleL2Gateway on Mantle. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
        discovery.getContractDetails('EraL1Gateway', {
          description:
            'L1 counterpart receiving messages from the EraL2Gateway on ZKsync Era. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
        discovery.getContractDetails('ArbitrumL1Gateway', {
          description:
            'L1 counterpart receiving messages from the ArbitrumL2Gateway on Arbitrum One. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
        discovery.getContractDetails('BlastL1Gateway', {
          description:
            'L1 counterpart receiving messages from the BlastL2Gateway on Blast. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
        discovery.getContractDetails('OptimismL1Gateway', {
          description:
            'L1 counterpart receiving messages from the OptimismL2Gateway on OP Mainnet. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
        discovery.getContractDetails('BaseL1Gateway', {
          description:
            'L1 counterpart receiving messages from the BaseL2Gateway on Base. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
        discovery.getContractDetails('ScrollL1Gateway', {
          description:
            'L1 counterpart receiving messages from the ScrollL2Gateway on Scroll. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
      ],
      optimism: [
        discovery.getContractDetails('OptimismL1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from OP Mainnet to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...optimismUpgradability,
        }),
        discovery.getContractDetails('OptimismzkLink', {
          description:
            "Main messaging contract on OP Mainnet and ETH escrow. Outgoing messages (like deposits) are sent through the OptimismL2Gateway which ultimately makes use of OP Mainnet's canonical messaging bridge to reach the Arbitrator on L1. Only whitelisted validators can sync messages with zkLink Nova, which also transfer the ETH to it via the respective canonical bridges. Incoming messages (like withdrawals) are validated on Linea first and then sent to this contract through the same path. Whitelisted validators can also relay messages to zkLink without going through the canonical bridge (fast path), which are later cross-checked with the slow path. If the check fails, the system halts.",
          ...optimismUpgradability,
        }),
        discovery.getContractDetails('OptimismL2Gateway', {
          description:
            "High level interface between the local zkLink contract and OP's message service.",
          ...optimismUpgradability,
        }),
      ],
      arbitrum: [
        discovery.getContractDetails('ArbitrumL1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from Arbitrum One to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...arbitrumUpgradability,
        }),
        discovery.getContractDetails('ArbitrumzkLink', {
          description:
            "Main messaging contract on Arbitrum One and ETH escrow. Outgoing messages (like deposits) are sent through the ArbitrumL2Gateway which ultimately makes use of Arbitrum One's canonical messaging bridge to reach the Arbitrator on L1. Only whitelisted validators can sync messages with zkLink Nova, which also transfer the ETH to it via the respective canonical bridges. Incoming messages (like withdrawals) are validated on Linea first and then sent to this contract through the same path. Whitelisted validators can also relay messages to zkLink without going through the canonical bridge (fast path), which are later cross-checked with the slow path. If the check fails, the system halts.",
          ...arbitrumUpgradability,
        }),
        discovery.getContractDetails('ArbitrumL2Gateway', {
          description:
            "High level interface between the local zkLink contract and Arbitrum's message service.",
          ...arbitrumUpgradability,
        }),
      ],
      base: [
        discovery.getContractDetails('BaseL1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from Base to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...baseUpgradability,
        }),
        discovery.getContractDetails('BasezkLink', {
          description:
            "Main messaging contract on Base and ETH escrow. Outgoing messages (like deposits) are sent through the BaseL2Gateway which ultimately makes use of Base's canonical messaging bridge to reach the Arbitrator on L1. Only whitelisted validators can sync messages with zkLink Nova, which also transfer the ETH to it via the respective canonical bridges. Incoming messages (like withdrawals) are validated on Linea first and then sent to this contract through the same path. Whitelisted validators can also relay messages to zkLink without going through the canonical bridge (fast path), which are later cross-checked with the slow path. If the check fails, the system halts.",
          ...baseUpgradability,
        }),
        discovery.getContractDetails('BaseL2Gateway', {
          description:
            "High level interface between the local zkLink contract and Base's message service.",
          ...baseUpgradability,
        }),
      ],
      mantapacific: [
        discovery.getContractDetails('MantaL1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from Manta Pacific to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...mantapacificUpgradability,
        }),
        discovery.getContractDetails('MantazkLink', {
          description:
            "Main messaging contract on Manta Pacific and ETH escrow. Outgoing messages (like deposits) are sent through the MantaPacificL2Gateway which ultimately makes use of Manta Pacific's canonical messaging bridge to reach the Arbitrator on L1. Only whitelisted validators can sync messages with zkLink Nova, which also transfer the ETH to it via the respective canonical bridges. Incoming messages (like withdrawals) are validated on Linea first and then sent to this contract through the same path. Whitelisted validators can also relay messages to zkLink without going through the canonical bridge (fast path), which are later cross-checked with the slow path. If the check fails, the system halts.",
          ...mantapacificUpgradability,
        }),
        discovery.getContractDetails('MantaL2Gateway', {
          description:
            "High level interface between the local zkLink contract and Manta Pacific's message service.",
          ...mantapacificUpgradability,
        }),
      ],
      mantle: [
        discovery.getContractDetails('MantleL1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from Mantle to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...mantleUpgradability,
        }),
        discovery.getContractDetails('MantlezkLink', {
          description:
            "Main messaging contract on Mantle and ETH escrow. Outgoing messages (like deposits) are sent through the MantleL2Gateway which ultimately makes use of Mantle's canonical messaging bridge to reach the Arbitrator on L1. Only whitelisted validators can sync messages with zkLink Nova, which also transfer the ETH to it via the respective canonical bridges. Incoming messages (like withdrawals) are validated on Linea first and then sent to this contract through the same path. Whitelisted validators can also relay messages to zkLink without going through the canonical bridge (fast path), which are later cross-checked with the slow path. If the check fails, the system halts.",
          ...mantleUpgradability,
        }),
        discovery.getContractDetails('MantleL2Gateway', {
          description:
            "High level interface between the local zkLink contract and Mantle's message service.",
          ...mantleUpgradability,
        }),
      ],
      scroll: [
        discovery.getContractDetails('ScrollL1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from Scroll to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...scrollUpgradability,
        }),
        discovery.getContractDetails('ScrollzkLink', {
          description:
            "Main messaging contract on Scroll and ETH escrow. Outgoing messages (like deposits) are sent through the ScrollL2Gateway which ultimately makes use of Scroll's canonical messaging bridge to reach the Arbitrator on L1. Only whitelisted validators can sync messages with zkLink Nova, which also transfer the ETH to it via the respective canonical bridges. Incoming messages (like withdrawals) are validated on Linea first and then sent to this contract through the same path. Whitelisted validators can also relay messages to zkLink without going through the canonical bridge (fast path), which are later cross-checked with the slow path. If the check fails, the system halts.",
          ...scrollUpgradability,
        }),
        discovery.getContractDetails('ScrollL2Gateway', {
          description:
            "High level interface between the local zkLink contract and Scroll's message service.",
          ...scrollUpgradability,
        }),
      ],
      blast: [
        discovery.getContractDetails('BlastL1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from Blast to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...blastUpgradability,
        }),
        discovery.getContractDetails('BlastzkLink', {
          description:
            "Main messaging contract on Blast and ETH escrow. Outgoing messages (like deposits) are sent through the BlastL2Gateway which ultimately makes use of Blast's canonical messaging bridge to reach the Arbitrator on L1. Only whitelisted validators can sync messages with zkLink Nova, which also transfer the ETH to it via the respective canonical bridges. Incoming messages (like withdrawals) are validated on Linea first and then sent to this contract through the same path. Whitelisted validators can also relay messages to zkLink without going through the canonical bridge (fast path), which are later cross-checked with the slow path. If the check fails, the system halts.",
          ...blastUpgradability,
        }),
        discovery.getContractDetails('BlastL2Gateway', {
          description:
            "High level interface between the local zkLink contract and Blast's message service.",
          ...blastUpgradability,
        }),
      ],
      zksync2: [
        discovery.getContractDetails('EraL1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from ZKsync Era to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...zksync2Upgradability,
        }),
        discovery.getContractDetails('ErazkLink', {
          description:
            "Main messaging contract on ZKsync Era and ETH escrow. Outgoing messages (like deposits) are sent through the ZKsync2L2Gateway which ultimately makes use of ZKsync Era's canonical messaging bridge to reach the Arbitrator on L1. Only whitelisted validators can sync messages with zkLink Nova, which also transfer the ETH to it via the respective canonical bridges. Incoming messages (like withdrawals) are validated on Linea first and then sent to this contract through the same path. Whitelisted validators can also relay messages to zkLink without going through the canonical bridge (fast path), which are later cross-checked with the slow path. If the check fails, the system halts.",
          ...zksync2Upgradability,
        }),
        /* it doesn't get discovered because the zkLink contract is currently unverified
        zksync2Discovery.getContractDetails('EraL2Gateway', {
          description:
            "High level interface between the local zkLink contract and ZKsync Era's message service.",
          ...zksync2Upgradability,
        }),
        */
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    linea: {
      actors: [
        discovery.getMultisigPermission(
          'LineaOwner',
          'Admin of the main zkLink contract, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
        discovery.getPermissionDetails(
          'Validators',
          discovery.getPermissionedAccounts('LineazkLink', 'validators'),
          'Permissioned actors that can commit, prove and execute blocks. It can also "fast" relay messages to zkLink Nova without going through the canonical bridges, meaning it can potentially relay invalid messages and mint tokens out of thin air. In that case, since the system checks such messages against the slow path, after some time the system would halt.',
        ),
      ],
    },
    optimism: {
      actors: [
        discovery.contractAsPermissioned(
          discovery.getContract('OptimismProxyAdmin'),
          'Owner of the L1ERC20Bridge on OP Mainnet.',
        ),
        discovery.getMultisigPermission(
          'OptimismOwner',
          'Admin of the zkLink contract on OP Mainnet and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
      ],
    },
    arbitrum: {
      actors: [
        discovery.contractAsPermissioned(
          discovery.getContract('ArbitrumProxyAdmin'),
          'Owner of the L1ERC20Bridge on Arbitrum One.',
        ),
        discovery.getMultisigPermission(
          'ArbitrumOwner',
          'Admin of the zkLink contract on Arbitrum One and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
      ],
    },
    base: {
      actors: [
        discovery.contractAsPermissioned(
          discovery.getContract('BaseProxyAdmin'),
          'Owner of the L1ERC20Bridge on Base.',
        ),
        discovery.getMultisigPermission(
          'BaseOwner',
          'Admin of the zkLink contract on Base and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
      ],
    },
    mantapacific: {
      actors: [
        discovery.contractAsPermissioned(
          discovery.getContract('MantaProxyAdmin'),
          'Owner of the L1ERC20Bridge on Manta Pacific.',
        ),
        discovery.getPermissionDetails(
          'MantaOwner',
          discovery.getPermissionedAccounts('MantaProxyAdmin', 'owner'),
          'Admin of the zkLink contract on Manta Pacific and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gaining access to all funds.',
        ),
      ],
    },
    mantle: {
      actors: [
        discovery.contractAsPermissioned(
          discovery.getContract('MantleProxyAdmin'),
          'Owner of the L1ERC20Bridge on Mantle.',
        ),
        discovery.getMultisigPermission(
          'MantleOwner',
          'Admin of the zkLink contract on Mantle and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
      ],
    },
    scroll: {
      actors: [
        discovery.contractAsPermissioned(
          discovery.getContract('ScrollProxyAdmin'),
          'Owner of the L1ERC20Bridge on Scroll.',
        ),
        discovery.getMultisigPermission(
          'ScrollOwner',
          'Admin of the zkLink contract on Scroll and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
      ],
    },
    blast: {
      actors: [
        discovery.contractAsPermissioned(
          discovery.getContract('BlastProxyAdmin'),
          'Owner of the L1ERC20Bridge on Blast.',
        ),
        discovery.getMultisigPermission(
          'BlastOwner',
          'Admin of the zkLink contract on Blast and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
      ],
    },
    zksync2: {
      actors: [
        discovery.contractAsPermissioned(
          discovery.getContract('EraProxyAdmin'),
          'Owner of the L1ERC20Bridge on ZKsync Era.',
        ),
        discovery.getMultisigPermission(
          'EraOwner',
          'Admin of the zkLink contract on ZKsync Era and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
      ],
    },
    ethereum: {
      actors: [
        discovery.contractAsPermissioned(
          discovery.getContract('EthereumProxyAdmin'),
          'Owner of the L1ERC20Bridge on Ethereum.',
        ),
        discovery.getMultisigPermission(
          'EthereumOwner',
          'Admin of the zkLink contract on Ethereum and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([
    discovery,
    discovery,
    discovery,
    discovery,
    discovery,
    discovery,
    discovery,
    discovery,
    discovery,
    discovery,
  ]),
}
