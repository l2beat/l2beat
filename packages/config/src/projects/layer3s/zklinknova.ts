import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Layer3 } from './types'

const optimismDiscovery = new ProjectDiscovery('zklinknova', 'optimism')
const arbitrumDiscovery = new ProjectDiscovery('zklinknova', 'arbitrum')
const baseDiscovery = new ProjectDiscovery('zklinknova', 'base')
const mantapacificDiscovery = new ProjectDiscovery('zklinknova', 'mantapacific')
// const ethereumDiscovery = new ProjectDiscovery('zklinknova')

const optimismUpgradability = {
  upgradableBy: ['OptimismOwner'],
  upgradeDelay: 'No delay',
}

const arbitrumUpgradability = {
  upgradableBy: ['ArbitrumOwner'],
  upgradeDelay: 'No delay',
}

const baseUpgradability = {
  upgradableBy: ['BaseOwner'],
  upgradeDelay: 'No delay',
}

const mantapacificUpgradability = {
  upgradableBy: ['MantaPacificOwner'],
  upgradeDelay: 'No delay',
}

export const zklinknova: Layer3 = {
  type: 'layer3',
  id: ProjectId('zklinknova'),
  hostChain: ProjectId('linea'),
  display: {
    name: 'zkLink Nova',
    slug: 'zklinknova',
    description:
      'zkLink Nova is a Layer 3 zkEVM Rollup network leveraging ZK Stack that allows for scattered assets across Ethereum Layer 2s to be aggregated for interoperable trade and transactions.',
    purposes: ['Universal'],
    category: 'Validium',
    provider: 'zkLink Nexus',
    links: {
      websites: ['https://zklink.io', 'https://zk.link'],
      apps: ['https://app.zklink.io', 'https://portal.zklink.io'],
      documentation: ['https://docs.zklink.io'],
      explorers: ['https://explorer.zklink.io'],
      repositories: ['https://github.com/zkLinkProtocol'],
      socialMedia: [
        'https://blog.zk.link',
        'https://twitter.com/zkLink_Official',
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
    escrows: [
      {
        chain: 'optimism',
        includeInTotal: false,
        address: EthereumAddress('0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b'),
        sinceTimestamp: new UnixTime(1711092485),
        tokens: ['ETH'],
        source: 'external',
        bridge: {
          name: 'zkLink Nova Bridge from Optimism',
        },
      },
      {
        chain: 'optimism',
        includeInTotal: false,
        address: EthereumAddress('0x5Bd51296423A9079b931414C1De65e7057326EaA'),
        sinceTimestamp: new UnixTime(1711095511),
        tokens: '*',
        source: 'external',
        bridge: {
          name: 'zkLink Nova Bridge from Optimism',
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
        bridge: {
          name: 'zkLink Nova Bridge from Ethereum',
        },
      },
      {
        chain: 'ethereum',
        includeInTotal: false,
        address: EthereumAddress('0xAd16eDCF7DEB7e90096A259c81269d811544B6B6'),
        sinceTimestamp: new UnixTime(1709295323),
        tokens: '*',
        bridge: {
          name: 'zkLink Nova Bridge from Ethereum',
        },
      },
      {
        chain: 'mantapacific',
        includeInTotal: false,
        address: EthereumAddress('0xd784d7128b46b60ca7d8bdc17dcec94917455657'),
        sinceTimestamp: new UnixTime(1709279099),
        tokens: ['ETH'],
        source: 'external',
        bridge: {
          name: 'zkLink Nova Bridge from Mantapacific',
        },
      },
      {
        chain: 'mantapacific',
        includeInTotal: false,
        address: EthereumAddress('0x44a65dc12865a1e5249b45b4868f32b0e37168ff'),
        sinceTimestamp: new UnixTime(1709295839),
        tokens: '*',
        source: 'external',
        bridge: {
          name: 'zkLink Nova Bridge from Mantapacific',
        },
      },
      {
        chain: 'mantle',
        includeInTotal: false,
        address: EthereumAddress('0xD784d7128B46B60Ca7d8BdC17dCEC94917455657'),
        sinceTimestamp: new UnixTime(1709279309),
        tokens: ['MNT'],
        source: 'external',
        bridge: {
          name: 'zkLink Nova Bridge from Mantle',
        },
      },
      {
        chain: 'mantle',
        includeInTotal: false,
        address: EthereumAddress('0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2'),
        sinceTimestamp: new UnixTime(1709296907),
        tokens: '*',
        source: 'external',
        bridge: {
          name: 'zkLink Nova Bridge from Mantle',
        },
      },
      {
        chain: 'zksync2',
        includeInTotal: false,
        address: EthereumAddress('0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A'),
        sinceTimestamp: new UnixTime(1709280600),
        tokens: ['ETH'],
        source: 'external',
        bridge: {
          name: 'zkLink Nova Bridge from ZKsync Era',
        },
      },
      {
        chain: 'zksync2',
        includeInTotal: false,
        address: EthereumAddress('0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08'),
        sinceTimestamp: new UnixTime(1709297040),
        tokens: '*',
        source: 'external',
        bridge: {
          name: 'zkLink Nova Bridge from ZKsync Era',
        },
      },
      {
        chain: 'arbitrum',
        includeInTotal: false,
        address: EthereumAddress('0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A'),
        sinceTimestamp: new UnixTime(1709280428),
        tokens: ['ETH'],
        source: 'external',
        bridge: {
          name: 'zkLink Nova Bridge from Arbitrum',
        },
      },
      {
        chain: 'arbitrum',
        includeInTotal: false,
        address: EthereumAddress('0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585'),
        sinceTimestamp: new UnixTime(1709296973),
        tokens: '*',
        source: 'external',
        bridge: {
          name: 'zkLink Nova Bridge from Arbitrum',
        },
      },
      {
        chain: 'blast',
        includeInTotal: false,
        address: EthereumAddress('0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD'),
        sinceTimestamp: new UnixTime(1710417729),
        tokens: ['ETH'],
        source: 'external',
        bridge: {
          name: 'zkLink Nova Bridge from Blast',
        },
      },
      {
        chain: 'blast',
        includeInTotal: false,
        address: EthereumAddress('0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b'),
        sinceTimestamp: new UnixTime(1710427013),
        tokens: '*',
        source: 'external',
        bridge: {
          name: 'zkLink Nova Bridge from Blast',
        },
      },
      {
        chain: 'base',
        includeInTotal: false,
        address: EthereumAddress('0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd'),
        sinceTimestamp: new UnixTime(1711095697),
        tokens: ['ETH'],
        source: 'external',
        bridge: {
          name: 'zkLink Nova Bridge from Base',
        },
      },
      {
        chain: 'base',
        includeInTotal: false,
        address: EthereumAddress('0x80d12A78EfE7604F00ed07aB2f16F643301674D5'),
        sinceTimestamp: new UnixTime(1711098033),
        tokens: '*',
        source: 'external',
        bridge: {
          name: 'zkLink Nova Bridge from Base',
        },
      },
    ],
  },
  riskView: {
    validatedBy: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    sourceUpgradeability: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    destinationToken: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    stateValidation: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    dataAvailability: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    exitWindow: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    sequencerFailure: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    proposerFailure: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
  },
  technology: {},
  contracts: {
    addresses: [],
    nativeAddresses: {
      /*
      ethereum: [
        ethereumDiscovery.getContractDetails('Arbitrator', {
          description: '',
        }),
      ],
      */
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
            "High level interface between the local zkLink contract and OP's L2CrossDomainMessenger.",
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
            "High level interface between the local zkLink contract and Arbitrum's L2 cross domain messenger contract.",
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
            "High level interface between the local zkLink contract and Base's L2CrossDomainMessenger.",
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
        mantapacificDiscovery.getContractDetails('MantaPacificL2Gateway', {
          description:
            "High level interface between the local zkLink contract and Manta Pacific's L2CrossDomainMessenger.", // TODO: check name of messenger contract
          ...mantapacificUpgradability,
        }),
      ],
    },
    risks: [],
  },
}
