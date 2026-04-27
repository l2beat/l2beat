import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  OPERATOR,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const genesisTimestamp = UnixTime(1742665129) // 2025-03-22T17:38:49Z, block 1
const ethereumBridgeEscrow = EthereumAddress(
  '0x439D73635B9590E9d9e2CC9eCAB832B057d2E25B',
)
const ethereumBridgeAuthorizer = EthereumAddress(
  '0xE0E42c70880D57230FB843DB5eba6800533E91Ae',
)
const cotiBridgeEscrow = EthereumAddress(
  '0x61bf10a1a27b2d99de0a59a06200a62ed579d685',
)
const cotiSequencerAccount = EthereumAddress(
  '0xB557a07a397B5c9C94FC44260dE6C8A45EF5e731',
)
const cotiTreasury = EthereumAddress(
  '0x5e19f674b3B55dF897C09824a2ddFAD6939e3d1D',
)
const cotiGcotiOwner = EthereumAddress(
  '0x0fc92F51278c6d024aB6feb3527017F66d1DaD4d',
)

export const coti: ScalingProject = {
  type: 'layer2',
  id: ProjectId('coti'),
  capability: 'universal',
  hasTestnet: true,
  addedAt: UnixTime(1712133479), // 2024-04-03T08:37:59Z
  badges: [BADGES.VM.EVM, BADGES.Other.Privacy],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  proofSystem: undefined,
  display: {
    name: 'COTI',
    slug: 'coti',
    redWarning: {
      text: 'Bridge-outs from COTI to Ethereum rely on externally controlled actors and there is no trustless withdrawal or force-inclusion mechanism.',
      detailAnchor: 'permissions',
    },
    description:
      'COTI is an EVM-compatible privacy chain connected to Ethereum, using MPC and garbled circuits for confidential smart contracts and private token interactions.',
    purposes: ['Universal', 'Privacy'],
    links: {
      websites: ['https://coti.io/'],
      bridges: ['https://bridge.coti.io'],
      documentation: ['https://docs.coti.io/coti-documentation'],
      explorers: ['https://mainnet.cotiscan.io'],
      repositories: ['https://github.com/coti-io'],
      socialMedia: [
        'https://twitter.com/COTInetwork',
        'https://medium.com/@cotinetwork',
        'https://t.me/COTInetwork',
        'https://discord.gg/9tq6CP6XrT',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    associatedTokens: [
      'COTI',
      'gCOTI',
      'USDC.e',
      'wETH',
      'wBTC',
      'wADA',
      'USDT',
      'KING',
    ],
    escrows: [
      {
        chain: 'ethereum',
        address: ethereumBridgeEscrow,
        sinceTimestamp: genesisTimestamp,
        tokens: ['COTI', 'gCOTI'],
      },
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
  },
  chainConfig: {
    name: 'coti',
    chainId: 2632500,
    gasTokens: ['COTI'],
    explorerUrl: 'https://mainnet.cotiscan.io',
    sinceTimestamp: genesisTimestamp,
    coingeckoPlatform: 'coti',
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 290792,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.coti.io/rpc',
        callsPerMinute: 300,
      },
      {
        type: 'blockscout',
        url: 'https://mainnet.cotiscan.io/api',
      },
      {
        type: 'blockscoutV2',
        url: 'https://mainnet.cotiscan.io/api/v2',
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.NONE,
    bridge: DA_BRIDGES.NONE,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stateValidation: {
    categories: [
      {
        title: 'No state validation',
        description:
          'Ethereum does not verify COTI state transitions. Public COTI documentation describes a sequencer, full nodes, and MPC-style executors, while team-provided operational details describe a small operator set and an N out of N honest-threshold assumption for current operation.',
        references: [
          {
            title: 'COTI Architecture - COTI docs',
            url: 'https://docs.coti.io/coti-documentation/how-coti-works/introduction/coti-architecture',
          },
          {
            title: 'Running a COTI Node - COTI docs',
            url: 'https://docs.coti.io/coti-documentation/running-a-coti-node',
          },
        ],
        risks: [
          {
            category: 'Users can be censored if',
            text: 'the sequencer or bridge operators refuse to process transactions or bridge-out requests.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'the operator set authorizes minting or releasing assets on Ethereum without matching deposits or burns on COTI.',
          },
          {
            category: 'Funds can be frozen if',
            text: 'the operator set goes offline, because there is no trustless withdrawal path to Ethereum.',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: {
      ethereum: [
        {
          name: 'COTI Token',
          chain: 'ethereum',
          address: ChainSpecificAddress.fromLong(
            'ethereum',
            '0xDDB3422497E61e13543BeA06989C0789117555c5',
          ),
          isVerified: true,
          description:
            'Ethereum ERC-20 token supported by the official COTI bridge.',
        },
        {
          name: 'gCOTI Token',
          chain: 'ethereum',
          address: ChainSpecificAddress.fromLong(
            'ethereum',
            '0xAf2CA40d3fc4459436D11B94d21FA4b8A89fB51d',
          ),
          isVerified: true,
          description:
            'Ethereum ERC-20 governance token supported by the official COTI bridge.',
        },
      ],
      coti: [
        {
          name: 'AccountOnboard',
          chain: 'coti',
          address: ChainSpecificAddress.fromLong(
            'coti',
            '0x536A67f0cc46513E7d27a370ed1aF9FDcC7A5095',
          ),
          isVerified: true,
          description:
            'Contract used to onboard accounts for private state access and key management on COTI.',
        },
        {
          name: 'DeterministicDeploymentProxy',
          chain: 'coti',
          address: ChainSpecificAddress.fromLong(
            'coti',
            '0x4e59b44847b379578588920ca78fbf26c0b4956c',
          ),
          isVerified: true,
          description:
            'Deterministic deployment helper available on COTI mainnet.',
        },
        {
          name: 'gCOTI Token',
          chain: 'coti',
          address: ChainSpecificAddress.fromLong(
            'coti',
            '0x7637C7838EC4Ec6b85080F28A678F8E234bB83D1',
          ),
          isVerified: true,
          description: 'COTI Treasury governance token on COTI mainnet.',
        },
        {
          name: 'USDC.e Token',
          chain: 'coti',
          address: ChainSpecificAddress.fromLong(
            'coti',
            '0xf1Feebc4376c68B7003450ae66343Ae59AB37D3C',
          ),
          isVerified: true,
          description: 'Bridged USDC token contract on COTI.',
        },
        {
          name: 'wETH Token',
          chain: 'coti',
          address: ChainSpecificAddress.fromLong(
            'coti',
            '0x639aCc80569c5FC83c6FBf2319A6Cc38bBfe26d1',
          ),
          isVerified: true,
          description: 'Wrapped Ether token contract on COTI.',
        },
        {
          name: 'wBTC Token',
          chain: 'coti',
          address: ChainSpecificAddress.fromLong(
            'coti',
            '0x8C39B1fD0e6260fdf20652Fc436d25026832bfEA',
          ),
          isVerified: true,
          description: 'Wrapped BTC token contract on COTI.',
        },
        {
          name: 'wADA Token',
          chain: 'coti',
          address: ChainSpecificAddress.fromLong(
            'coti',
            '0xe757Ca19d2c237AA52eBb1d2E8E4368eeA3eb331',
          ),
          isVerified: true,
          description: 'Wrapped ADA token contract on COTI.',
        },
        {
          name: 'USDT Token',
          chain: 'coti',
          address: ChainSpecificAddress.fromLong(
            'coti',
            '0xfA6f73446b17A97a56e464256DA54AD43c2Cbc3E',
          ),
          isVerified: true,
          description: 'Tether USD token contract on COTI.',
        },
      ],
    },
    risks: [],
  },
  permissions: {
    ethereum: {
      actors: [
        {
          id: 'coti-bridge-ethereum-escrow',
          name: 'Official bridge escrow',
          chain: 'ethereum',
          description:
            'EOA that receives deposits for the official COTI bridge on Ethereum and holds bridged COTI and gCOTI.',
          accounts: [
            {
              name: 'Official bridge escrow',
              address: ChainSpecificAddress.fromLong(
                'ethereum',
                ethereumBridgeEscrow,
              ),
              url: `https://etherscan.io/address/${ethereumBridgeEscrow}`,
              type: 'EOA',
              isVerified: false,
            },
          ],
        },
        {
          id: 'coti-bridge-ethereum-authorizer',
          name: 'Bridge authorizer',
          chain: 'ethereum',
          description:
            'EOA that authorizes minting or release of assets on Ethereum when users bridge out from COTI.',
          accounts: [
            {
              name: 'Bridge authorizer',
              address: ChainSpecificAddress.fromLong(
                'ethereum',
                ethereumBridgeAuthorizer,
              ),
              url: `https://etherscan.io/address/${ethereumBridgeAuthorizer}`,
              type: 'EOA',
              isVerified: false,
            },
          ],
        },
      ],
    },
    coti: {
      actors: [
        {
          id: 'coti-bridge-coti-escrow',
          name: 'Bridge deposit and inflation address',
          chain: 'coti',
          description:
            'EOA that receives deposits on COTI for bridge-outs to Ethereum and is also documented as the source of inflation on COTI.',
          accounts: [
            {
              name: 'Bridge deposit and inflation address',
              address: ChainSpecificAddress.fromLong('coti', cotiBridgeEscrow),
              url: `https://mainnet.cotiscan.io/address/${cotiBridgeEscrow}`,
              type: 'EOA',
              isVerified: false,
            },
          ],
          references: [
            {
              title: 'Contracts Addresses - COTI docs',
              url: 'https://docs.coti.io/coti-documentation/networks/mainnet/contracts-addresses',
            },
          ],
        },
        {
          id: 'coti-sequencer-account',
          name: 'Sequencer account',
          chain: 'coti',
          description:
            'Publicly listed sequencer fees account. Team-provided details say the COTI Foundation operates the sequencer today.',
          accounts: [
            {
              name: 'Sequencer account',
              address: ChainSpecificAddress.fromLong(
                'coti',
                cotiSequencerAccount,
              ),
              url: `https://mainnet.cotiscan.io/address/${cotiSequencerAccount}`,
              type: 'EOA',
              isVerified: false,
            },
          ],
          references: [
            {
              title: 'Contracts Addresses - COTI docs',
              url: 'https://docs.coti.io/coti-documentation/networks/mainnet/contracts-addresses',
            },
          ],
        },
        {
          id: 'coti-gcoti-owner',
          name: 'gCOTI owner',
          chain: 'coti',
          description: 'Owner account of the gCOTI token contract on COTI.',
          accounts: [
            {
              name: 'gCOTI owner',
              address: ChainSpecificAddress.fromLong('coti', cotiGcotiOwner),
              url: `https://mainnet.cotiscan.io/address/${cotiGcotiOwner}`,
              type: 'EOA',
              isVerified: false,
            },
          ],
          references: [
            {
              title: 'Contracts Addresses - COTI docs',
              url: 'https://docs.coti.io/coti-documentation/networks/mainnet/contracts-addresses',
            },
          ],
        },
        {
          id: 'coti-treasury',
          name: 'Treasury',
          chain: 'coti',
          description: 'Publicly listed treasury account on COTI.',
          accounts: [
            {
              name: 'Treasury',
              address: ChainSpecificAddress.fromLong('coti', cotiTreasury),
              url: `https://mainnet.cotiscan.io/address/${cotiTreasury}`,
              type: 'EOA',
              isVerified: false,
            },
          ],
          references: [
            {
              title: 'Contracts Addresses - COTI docs',
              url: 'https://docs.coti.io/coti-documentation/networks/mainnet/contracts-addresses',
            },
          ],
        },
      ],
    },
  },
  technology: {
    dataAvailability: {
      name: 'Data availability relies on the COTI network',
      description:
        'The reviewed documentation describes COTI full nodes synchronizing and verifying the chain, but it does not describe transaction data being posted to Ethereum or another external data availability layer with an onchain bridge.',
      references: [
        {
          title: 'COTI Architecture - COTI docs',
          url: 'https://docs.coti.io/coti-documentation/how-coti-works/introduction/coti-architecture',
        },
        {
          title: 'Running a COTI Node - COTI docs',
          url: 'https://docs.coti.io/coti-documentation/running-a-coti-node',
        },
      ],
      risks: [
        {
          category: 'Funds can be frozen if',
          text: 'transaction data becomes unavailable to users and full nodes.',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      description:
        'The documented architecture includes a sequencer that processes transactions and organizes them into blocks. Team-provided operational details say the COTI Foundation runs the sequencer today and that the network halts if the active operators go offline.',
      references: [
        {
          title: 'COTI Architecture - COTI docs',
          url: 'https://docs.coti.io/coti-documentation/how-coti-works/introduction/coti-architecture',
        },
        {
          title: 'Contracts Addresses - COTI docs',
          url: 'https://docs.coti.io/coti-documentation/networks/mainnet/contracts-addresses',
        },
      ],
    },
    forceTransactions: {
      name: 'No forced inclusion mechanism',
      description:
        'Users cannot submit transactions directly to a block producer or enforce inclusion through Ethereum if the sequencer refuses to process them.',
      references: [
        {
          title: 'COTI Architecture - COTI docs',
          url: 'https://docs.coti.io/coti-documentation/how-coti-works/introduction/coti-architecture',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'the sequencer refuses to include their transactions.',
        },
      ],
    },
    exitMechanisms: [
      {
        name: 'Operator-authorized bridge-out to Ethereum',
        description:
          'To bridge assets back to Ethereum, users deposit on the COTI bridge address on COTI and an externally controlled address authorizes minting on Ethereum. Team-provided operational details say this path is immediate when the bridge operator is online, but there is no trustless force-withdrawal path.',
        risks: [
          {
            category: 'Funds can be frozen if',
            text: 'the Ethereum bridge authorizer or supporting operators stop cooperating.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'the Ethereum bridge authorizer mints or releases assets without matching deposits or burns on COTI.',
          },
        ],
        references: [
          {
            title: 'COTI Bridge - COTI docs',
            url: 'https://docs.coti.io/coti-documentation/coti-bridge',
          },
        ],
      },
    ],
    otherConsiderations: [
      {
        name: 'Privacy is provided through MPC and garbled circuits',
        description:
          'COTI extends the EVM with private computation primitives and uses garbled circuits within a broader MPC design to support confidential balances, private token transfers, and confidential smart contract execution.',
        risks: [],
        references: [
          {
            title: 'MainNet - COTI docs',
            url: 'https://docs.coti.io/coti-documentation/networks/mainnet',
          },
          {
            title: 'Garbled Circuits - COTI docs',
            url: 'https://docs.coti.io/coti-documentation/how-coti-works/advanced-topics/garbled-circuits',
          },
        ],
      },
      {
        name: 'Secure enclaves are optional hardening, not the core assumption',
        description:
          'The official documentation says secure enclaves are planned as an additional protection layer, but are not required for protocol integrity.',
        risks: [],
        references: [
          {
            title: 'Garbled Circuits - COTI docs',
            url: 'https://docs.coti.io/coti-documentation/how-coti-works/advanced-topics/garbled-circuits',
          },
        ],
      },
    ],
  },
  milestones: [
    {
      title: 'COTI Mainnet launch',
      url: 'https://docs.coti.io/coti-documentation/networks/mainnet',
      date: '2025-03-22T00:00:00Z',
      description: 'COTI EVM mainnet launched.',
      type: 'general',
    },
    {
      title: 'ChainPort adds COTI bridging',
      url: 'https://blog.chainport.io/news/coti-network-supported-by-chainport-for-ada-usdt-bridging',
      date: '2026-01-05T00:00:00Z',
      description:
        'ChainPort announced support for bridging ADA and USDT into COTI.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([]),
}
