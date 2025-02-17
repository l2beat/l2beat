import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'

const optimismDiscovery = new ProjectDiscovery('zklinknova', 'optimism')
const arbitrumDiscovery = new ProjectDiscovery('zklinknova', 'arbitrum')
const baseDiscovery = new ProjectDiscovery('zklinknova', 'base')
const mantapacificDiscovery = new ProjectDiscovery('zklinknova', 'mantapacific')
const mantleDiscovery = new ProjectDiscovery('zklinknova', 'mantle')
const scrollDiscovery = new ProjectDiscovery('zklinknova', 'scroll')
const blastDiscovery = new ProjectDiscovery('zklinknova', 'blast')
const zksync2Discovery = new ProjectDiscovery('zklinknova', 'zksync2')
const ethereumDiscovery = new ProjectDiscovery('zklinknova')

const lineaDiscovery = new ProjectDiscovery('zklinknova', 'linea')

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

const executionDelaySeconds = lineaDiscovery.getContractValue<number>(
  'ValidatorTimelock',
  'executionDelay',
)

const upgradeDelaySeconds = lineaDiscovery.getContractValue<number>(
  'Governance',
  'minDelay',
)

export const zklinknova: Layer3 = {
  type: 'layer3',
  id: ProjectId('zklinknova'),
  capability: 'universal',
  addedAt: new UnixTime(1705330478), // 2024-01-15T14:54:38Z
  hostChain: ProjectId('linea'),
  badges: [Badge.VM.EVM, Badge.DA.DAC, Badge.L3ParentChain.Linea],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  display: {
    name: 'zkLink Nova',
    slug: 'zklinknova',
    description:
      'zkLink Nova is a Layer 3 zkEVM Validium network leveraging ZK Stack that allows for scattered assets across Ethereum Layer 2s to be aggregated for interoperable trade and transactions.',
    purposes: ['Universal', 'Interoperability'],
    category: 'Validium',
    links: {
      websites: ['https://zklink.io', 'https://zk.link'],
      apps: [
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
        'http://discord.gg/zklink',
        'https://t.me/zkLinkorg',
      ],
    },
  },
  chainConfig: {
    name: 'zklinknova',
    chainId: 810180,
    explorerUrl: 'https://explorer.zklink.io',
    explorerApi: {
      url: 'https://explorer-api.zklink.io/api',
      type: 'etherscan',
    },
    minTimestampForTvl: new UnixTime(1709273393),
  },
  config: {
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://rpc.zklink.io',
      defaultCallsPerMinute: 1500,
      startBlock: 1,
    },
    associatedTokens: ['ZKL'],
    escrows: [
      {
        chain: 'optimism',
        includeInTotal: false,
        address: EthereumAddress('0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b'),
        sinceTimestamp: new UnixTime(1711092485),
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
        sinceTimestamp: new UnixTime(1711095511),
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
        sinceTimestamp: new UnixTime(1709218085),
        tokens: ['ETH'],
      },
      {
        chain: 'linea',
        includeInTotal: false,
        address: EthereumAddress('0x62cE247f34dc316f93D3830e4Bf10959FCe630f8'),
        sinceTimestamp: new UnixTime(1709218113),
        tokens: '*',
      },
      {
        chain: 'ethereum',
        includeInTotal: false,
        address: EthereumAddress('0x5fD9F73286b7E8683Bab45019C94553b93e015Cf'),
        sinceTimestamp: new UnixTime(1709278799),
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
        sinceTimestamp: new UnixTime(1709295323),
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
        sinceTimestamp: new UnixTime(1709279099),
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
        sinceTimestamp: new UnixTime(1709295839),
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
        sinceTimestamp: new UnixTime(1709279309),
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
        sinceTimestamp: new UnixTime(1709296907),
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
        sinceTimestamp: new UnixTime(1709280600),
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
        sinceTimestamp: new UnixTime(1709297040),
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
        sinceTimestamp: new UnixTime(1709280428),
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
        sinceTimestamp: new UnixTime(1709296973),
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
        sinceTimestamp: new UnixTime(1710417729),
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
        sinceTimestamp: new UnixTime(1710427013),
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
        sinceTimestamp: new UnixTime(1711095697),
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
        sinceTimestamp: new UnixTime(1711098033),
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
    newCryptography: NEW_CRYPTOGRAPHY.ZK_BOTH,
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
      [lineaDiscovery.chain]: [
        lineaDiscovery.getContractDetails('L1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from Linea to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...lineaUpgradability,
        }),
        lineaDiscovery.getContractDetails('zkLink', {
          description:
            'Main contract of the system where blocks are committed, proven and executed. It syncs messages from secondary chains ("slow" path) and accepts "fast" forwarded requests from permissioned validators that are later cross-checked with the slow path. ETH coming from secondary chains are transferred and escrowed here. State roots are then synced back to the secondary chains.',
          ...lineaUpgradability,
        }),
        lineaDiscovery.getContractDetails('LineaL2Gateway', {
          description:
            "High level interface between the main zkLink contract and Linea's message service.",
          ...lineaUpgradability,
        }),
        lineaDiscovery.getContractDetails('ValidatorTimelock', {
          description: `Intermediary contract between the one of the validators and the ZKsync Era diamond that can delay block execution (ie withdrawals and other L3 --> L2 messages). Currently, the delay is set to ${formatSeconds(
            executionDelaySeconds,
          )}.`,
        }),
        lineaDiscovery.getContractDetails('Verifier', {
          description: 'Implements ZK proof verification logic.',
          ...lineaUpgradability,
        }),
        lineaDiscovery.getContractDetails('Governance', {
          description: `Intermediary governance contract with two roles and a customizable delay. This delay is only mandatory for transactions scheduled by the Owner role and can be set by the SecurityCouncil role. The SecurityCouncil role can execute arbitrary upgrade transactions immediately. Currently the delay is set to ${formatSeconds(
            upgradeDelaySeconds,
          )} and the SecurityCouncil role is not used.`,
        }),
      ],
      ethereum: [
        ethereumDiscovery.getContractDetails('L1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from Ethereum to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...ethereumUpgradability,
        }),
        ethereumDiscovery.getContractDetails('zkLink', {
          description:
            "Main messaging contract on Ethereum and ETH escrow. Outgoing messages (like deposits) are sent through the EthereumL2Gateway which ultimately makes use of Ethereum's canonical messaging bridge to reach the Arbitrator on L1. Only whitelisted validators can sync messages with zkLink Nova, which also transfer the ETH to it via the respective canonical bridges. Incoming messages (like withdrawals) are validated on Linea first and then sent to this contract through the same path. Whitelisted validators can also relay messages to zkLink without going through the canonical bridge (fast path), which are later cross-checked with the slow path. If the check fails, the system halts.",
          ...ethereumUpgradability,
        }),
        ethereumDiscovery.getContractDetails('EthereumL1Gateway', {
          description:
            "High level interface between the local zkLink contract and Ethereum's message service.",
          ...ethereumUpgradability,
        }),
        ethereumDiscovery.getContractDetails('Arbitrator', {
          description:
            'Contract storing the mapping between secondary chain bridges and acts as an intermediary to receive and relay messages to and from the main zkLink contract.',
          ...ethereumUpgradability,
        }),
        ethereumDiscovery.getContractDetails('LineaL1Gateway', {
          description:
            'L1 counterpart receiving messages from the LineaL2Gateway on Linea. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
        ethereumDiscovery.getContractDetails('MantaL1Gateway', {
          description:
            'L1 counterpart receiving messages from the MantaL2Gateway on Manta Pacific. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
        ethereumDiscovery.getContractDetails('MantleL1Gateway', {
          description:
            'L1 counterpart receiving messages from the MantleL2Gateway on Mantle. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
        ethereumDiscovery.getContractDetails('EraL1Gateway', {
          description:
            'L1 counterpart receiving messages from the EraL2Gateway on ZKsync Era. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
        ethereumDiscovery.getContractDetails('ArbitrumL1Gateway', {
          description:
            'L1 counterpart receiving messages from the ArbitrumL2Gateway on Arbitrum One. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
        ethereumDiscovery.getContractDetails('BlastL1Gateway', {
          description:
            'L1 counterpart receiving messages from the BlastL2Gateway on Blast. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
        ethereumDiscovery.getContractDetails('OptimismL1Gateway', {
          description:
            'L1 counterpart receiving messages from the OptimismL2Gateway on OP Mainnet. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
        ethereumDiscovery.getContractDetails('BaseL1Gateway', {
          description:
            'L1 counterpart receiving messages from the BaseL2Gateway on Base. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
        ethereumDiscovery.getContractDetails('ScrollL1Gateway', {
          description:
            'L1 counterpart receiving messages from the ScrollL2Gateway on Scroll. It redirects them to the Arbitrator contract.',
          ...ethereumUpgradability,
        }),
      ],
      optimism: [
        optimismDiscovery.getContractDetails('L1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from OP Mainnet to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...optimismUpgradability,
        }),
        optimismDiscovery.getContractDetails('zkLink', {
          description:
            "Main messaging contract on OP Mainnet and ETH escrow. Outgoing messages (like deposits) are sent through the OptimismL2Gateway which ultimately makes use of OP Mainnet's canonical messaging bridge to reach the Arbitrator on L1. Only whitelisted validators can sync messages with zkLink Nova, which also transfer the ETH to it via the respective canonical bridges. Incoming messages (like withdrawals) are validated on Linea first and then sent to this contract through the same path. Whitelisted validators can also relay messages to zkLink without going through the canonical bridge (fast path), which are later cross-checked with the slow path. If the check fails, the system halts.",
          ...optimismUpgradability,
        }),
        optimismDiscovery.getContractDetails('OptimismL2Gateway', {
          description:
            "High level interface between the local zkLink contract and OP's message service.",
          ...optimismUpgradability,
        }),
      ],
      arbitrum: [
        arbitrumDiscovery.getContractDetails('L1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from Arbitrum One to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...arbitrumUpgradability,
        }),
        arbitrumDiscovery.getContractDetails('zkLink', {
          description:
            "Main messaging contract on Arbitrum One and ETH escrow. Outgoing messages (like deposits) are sent through the ArbitrumL2Gateway which ultimately makes use of Arbitrum One's canonical messaging bridge to reach the Arbitrator on L1. Only whitelisted validators can sync messages with zkLink Nova, which also transfer the ETH to it via the respective canonical bridges. Incoming messages (like withdrawals) are validated on Linea first and then sent to this contract through the same path. Whitelisted validators can also relay messages to zkLink without going through the canonical bridge (fast path), which are later cross-checked with the slow path. If the check fails, the system halts.",
          ...arbitrumUpgradability,
        }),
        arbitrumDiscovery.getContractDetails('ArbitrumL2Gateway', {
          description:
            "High level interface between the local zkLink contract and Arbitrum's message service.",
          ...arbitrumUpgradability,
        }),
      ],
      base: [
        baseDiscovery.getContractDetails('L1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from Base to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...baseUpgradability,
        }),
        baseDiscovery.getContractDetails('zkLink', {
          description:
            "Main messaging contract on Base and ETH escrow. Outgoing messages (like deposits) are sent through the BaseL2Gateway which ultimately makes use of Base's canonical messaging bridge to reach the Arbitrator on L1. Only whitelisted validators can sync messages with zkLink Nova, which also transfer the ETH to it via the respective canonical bridges. Incoming messages (like withdrawals) are validated on Linea first and then sent to this contract through the same path. Whitelisted validators can also relay messages to zkLink without going through the canonical bridge (fast path), which are later cross-checked with the slow path. If the check fails, the system halts.",
          ...baseUpgradability,
        }),
        baseDiscovery.getContractDetails('BaseL2Gateway', {
          description:
            "High level interface between the local zkLink contract and Base's message service.",
          ...baseUpgradability,
        }),
      ],
      mantapacific: [
        mantapacificDiscovery.getContractDetails('L1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from Manta Pacific to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...mantapacificUpgradability,
        }),
        mantapacificDiscovery.getContractDetails('zkLink', {
          description:
            "Main messaging contract on Manta Pacific and ETH escrow. Outgoing messages (like deposits) are sent through the MantaPacificL2Gateway which ultimately makes use of Manta Pacific's canonical messaging bridge to reach the Arbitrator on L1. Only whitelisted validators can sync messages with zkLink Nova, which also transfer the ETH to it via the respective canonical bridges. Incoming messages (like withdrawals) are validated on Linea first and then sent to this contract through the same path. Whitelisted validators can also relay messages to zkLink without going through the canonical bridge (fast path), which are later cross-checked with the slow path. If the check fails, the system halts.",
          ...mantapacificUpgradability,
        }),
        mantapacificDiscovery.getContractDetails('MantaL2Gateway', {
          description:
            "High level interface between the local zkLink contract and Manta Pacific's message service.",
          ...mantapacificUpgradability,
        }),
      ],
      mantle: [
        mantleDiscovery.getContractDetails('L1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from Mantle to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...mantleUpgradability,
        }),
        mantleDiscovery.getContractDetails('zkLink', {
          description:
            "Main messaging contract on Mantle and ETH escrow. Outgoing messages (like deposits) are sent through the MantleL2Gateway which ultimately makes use of Mantle's canonical messaging bridge to reach the Arbitrator on L1. Only whitelisted validators can sync messages with zkLink Nova, which also transfer the ETH to it via the respective canonical bridges. Incoming messages (like withdrawals) are validated on Linea first and then sent to this contract through the same path. Whitelisted validators can also relay messages to zkLink without going through the canonical bridge (fast path), which are later cross-checked with the slow path. If the check fails, the system halts.",
          ...mantleUpgradability,
        }),
        mantleDiscovery.getContractDetails('MantleL2Gateway', {
          description:
            "High level interface between the local zkLink contract and Mantle's message service.",
          ...mantleUpgradability,
        }),
      ],
      scroll: [
        scrollDiscovery.getContractDetails('L1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from Scroll to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...scrollUpgradability,
        }),
        scrollDiscovery.getContractDetails('zkLink', {
          description:
            "Main messaging contract on Scroll and ETH escrow. Outgoing messages (like deposits) are sent through the ScrollL2Gateway which ultimately makes use of Scroll's canonical messaging bridge to reach the Arbitrator on L1. Only whitelisted validators can sync messages with zkLink Nova, which also transfer the ETH to it via the respective canonical bridges. Incoming messages (like withdrawals) are validated on Linea first and then sent to this contract through the same path. Whitelisted validators can also relay messages to zkLink without going through the canonical bridge (fast path), which are later cross-checked with the slow path. If the check fails, the system halts.",
          ...scrollUpgradability,
        }),
        scrollDiscovery.getContractDetails('ScrollL2Gateway', {
          description:
            "High level interface between the local zkLink contract and Scroll's message service.",
          ...scrollUpgradability,
        }),
      ],
      blast: [
        blastDiscovery.getContractDetails('L1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from Blast to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...blastUpgradability,
        }),
        blastDiscovery.getContractDetails('zkLink', {
          description:
            "Main messaging contract on Blast and ETH escrow. Outgoing messages (like deposits) are sent through the BlastL2Gateway which ultimately makes use of Blast's canonical messaging bridge to reach the Arbitrator on L1. Only whitelisted validators can sync messages with zkLink Nova, which also transfer the ETH to it via the respective canonical bridges. Incoming messages (like withdrawals) are validated on Linea first and then sent to this contract through the same path. Whitelisted validators can also relay messages to zkLink without going through the canonical bridge (fast path), which are later cross-checked with the slow path. If the check fails, the system halts.",
          ...blastUpgradability,
        }),
        blastDiscovery.getContractDetails('BlastL2Gateway', {
          description:
            "High level interface between the local zkLink contract and Blast's message service.",
          ...blastUpgradability,
        }),
      ],
      zksync2: [
        zksync2Discovery.getContractDetails('L1ERC20Bridge', {
          description:
            'Main entry point for depositing ERC20 tokens from ZKsync Era to zkLink Nova. Outgoing messages and incoming withdrawal validation is delegated to the zkLink contract.',
          ...zksync2Upgradability,
        }),
        zksync2Discovery.getContractDetails('zkLink', {
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
    [lineaDiscovery.chain]: {
      actors: [
        lineaDiscovery.getMultisigPermission(
          'LineaOwner',
          'Admin of the main zkLink contract, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
        lineaDiscovery.getPermissionDetails(
          'Validators',
          lineaDiscovery.getPermissionedAccounts('zkLink', 'validators'),
          'Permissioned actors that can commit, prove and execute blocks. It can also "fast" relay messages to zkLink Nova without going through the canonical bridges, meaning it can potentially relay invalid messages and mint tokens out of thin air. In that case, since the system checks such messages against the slow path, after some time the system would halt.',
        ),
      ],
    },
    optimism: {
      actors: [
        optimismDiscovery.contractAsPermissioned(
          optimismDiscovery.getContract('OptimismProxyAdmin'),
          'Owner of the L1ERC20Bridge on OP Mainnet.',
        ),
        optimismDiscovery.getMultisigPermission(
          'OptimismOwner',
          'Admin of the zkLink contract on OP Mainnet and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
      ],
    },
    arbitrum: {
      actors: [
        arbitrumDiscovery.contractAsPermissioned(
          arbitrumDiscovery.getContract('ArbitrumProxyAdmin'),
          'Owner of the L1ERC20Bridge on Arbitrum One.',
        ),
        arbitrumDiscovery.getMultisigPermission(
          'ArbitrumOwner',
          'Admin of the zkLink contract on Arbitrum One and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
      ],
    },
    base: {
      actors: [
        baseDiscovery.contractAsPermissioned(
          baseDiscovery.getContract('BaseProxyAdmin'),
          'Owner of the L1ERC20Bridge on Base.',
        ),
        baseDiscovery.getMultisigPermission(
          'BaseOwner',
          'Admin of the zkLink contract on Base and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
      ],
    },
    mantapacific: {
      actors: [
        mantapacificDiscovery.contractAsPermissioned(
          mantapacificDiscovery.getContract('MantaProxyAdmin'),
          'Owner of the L1ERC20Bridge on Manta Pacific.',
        ),
        mantapacificDiscovery.getPermissionDetails(
          'MantaOwner',
          mantapacificDiscovery.getPermissionedAccounts(
            'MantaProxyAdmin',
            'owner',
          ),
          'Admin of the zkLink contract on Manta Pacific and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gaining access to all funds.',
        ),
      ],
    },
    mantle: {
      actors: [
        mantleDiscovery.contractAsPermissioned(
          mantleDiscovery.getContract('MantleProxyAdmin'),
          'Owner of the L1ERC20Bridge on Mantle.',
        ),
        mantleDiscovery.getMultisigPermission(
          'MantleOwner',
          'Admin of the zkLink contract on Mantle and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
      ],
    },
    scroll: {
      actors: [
        scrollDiscovery.contractAsPermissioned(
          scrollDiscovery.getContract('ScrollProxyAdmin'),
          'Owner of the L1ERC20Bridge on Scroll.',
        ),
        scrollDiscovery.getMultisigPermission(
          'ScrollOwner',
          'Admin of the zkLink contract on Scroll and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
      ],
    },
    blast: {
      actors: [
        blastDiscovery.contractAsPermissioned(
          blastDiscovery.getContract('BlastProxyAdmin'),
          'Owner of the L1ERC20Bridge on Blast.',
        ),
        blastDiscovery.getMultisigPermission(
          'BlastOwner',
          'Admin of the zkLink contract on Blast and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
      ],
    },
    zksync2: {
      actors: [
        zksync2Discovery.contractAsPermissioned(
          zksync2Discovery.getContract('EraProxyAdmin'),
          'Owner of the L1ERC20Bridge on ZKsync Era.',
        ),
        zksync2Discovery.getMultisigPermission(
          'EraOwner',
          'Admin of the zkLink contract on ZKsync Era and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
      ],
    },
    ethereum: {
      actors: [
        ethereumDiscovery.contractAsPermissioned(
          ethereumDiscovery.getContract('EthereumProxyAdmin'),
          'Owner of the L1ERC20Bridge on Ethereum.',
        ),
        ethereumDiscovery.getMultisigPermission(
          'EthereumOwner',
          'Admin of the zkLink contract on Ethereum and the ProxyAdmin, meaning it can upgrade the bridge implementation and potentially gain access to all funds.',
        ),
      ],
    },
  },
}
