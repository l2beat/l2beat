import {
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_LAYERS,
  DA_MODES,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('polygon-pos')

const upgrades = {
  upgradableBy: [{ name: 'PolygonMultisig', delay: 'no' }],
}

const delayString = formatSeconds(
  discovery.getContractValue('Timelock', 'getMinDelay'),
)

const upgradeDelay = discovery.getContractValue<number>(
  'Timelock',
  'getMinDelay',
)

const currentValidatorSetSize = discovery.getContractValue<number>(
  'StakeManager',
  'currentValidatorSetSize',
)

const currentValidatorSetCap = discovery.getContractValue<number>(
  'StakeManager',
  'validatorThreshold',
)

const chainId = 137

export const polygonpos: ScalingProject = {
  type: 'layer2',
  id: ProjectId('polygon-pos'),
  capability: 'universal',
  addedAt: UnixTime(1664808578), // 2022-10-03T14:49:38Z
  badges: [BADGES.VM.EVM, BADGES.DA.CustomDA],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Polygon PoS',
    slug: 'polygon-pos',
    purposes: ['Universal'],
    category: 'Other',
    links: {
      websites: ['https://polygon.technology'],
      explorers: ['https://polygonscan.com'],
      bridges: ['https://wallet.polygon.technology'],
      repositories: ['https://github.com/maticnetwork/'],
      documentation: ['https://docs.polygon.technology/pos/'],
      socialMedia: [
        'https://twitter.com/0xPolygon',
        'https://forum.polygon.technology/',
        'https://reddit.com/r/0xPolygon/',
        'https://facebook.com/0xPolygon.Technology',
        'https://linkedin.com/company/0xpolygon/',
        'https://youtube.com/c/PolygonTV',
        'https://instagram.com/0xpolygon/',
      ],
    },
    description:
      'Polygon PoS is an EVM-compatible, proof of stake sidechain for Ethereum, planning to become a Validium with a state validating bridge. The bridge is currently validated by Polygon validators and allows for asset as well as data movement between Polygon and Ethereum.',
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    associatedTokens: ['POL', 'MATIC'],
    escrows: [
      discovery.getEscrowDetails({
        // DepositManager
        address: ChainSpecificAddress(
          'eth:0x401F6c983eA34274ec46f84D70b31C151321188b',
        ),
        tokens: '*',
        ...upgrades,
      }),
      discovery.getEscrowDetails({
        // ERC20Predicate
        address: ChainSpecificAddress(
          'eth:0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
        ),
        premintedTokens: ['TRADE'],
        tokens: '*',
        ...upgrades,
      }),
      discovery.getEscrowDetails({
        // MintableERC20Predicate
        address: ChainSpecificAddress(
          'eth:0x9923263fA127b3d1484cFD649df8f1831c2A74e4',
        ),
        tokens: '*',
        ...upgrades,
      }),
      discovery.getEscrowDetails({
        // EtherPredicate
        address: ChainSpecificAddress(
          'eth:0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30',
        ),
        tokens: ['ETH'],
        ...upgrades,
      }),
      discovery.getEscrowDetails({
        // ERC20EscrowPredicate for TOWER token
        address: ChainSpecificAddress(
          'eth:0x21ada4D8A799c4b0ADF100eB597a6f1321bCD3E4',
        ),
        tokens: '*',
        ...upgrades,
      }),
      // ...other predicates up until PolygonERC20MintBurnPredicate do not hold funds
      discovery.getEscrowDetails({
        // old MaticWETH contract escrowing ETH sent to Polygon
        address: ChainSpecificAddress(
          'eth:0xa45b966996374E9e65ab991C6FE4Bfce3a56DDe8',
        ),
        tokens: ['ETH'],
      }),
    ],
    activityConfig: {
      type: 'block',
      startBlock: 5000000,
    },
    trackedTxs: [
      {
        uses: [
          // checkpoint submission counts both as data submission and state update
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: ChainSpecificAddress.address(
            discovery.getContract('RootChain').address,
          ),
          selector: '0x4e43e495',
          functionSignature:
            'function submitCheckpoint(bytes data, uint256[3][] sigs)',
          sinceTimestamp: UnixTime(1590850580),
        },
      },
    ],
  },
  chainConfig: {
    name: 'polygonpos',
    chainId,
    explorerUrl: 'https://polygonscan.com',
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 25770160,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://polygon.llamarpc.com',
        callsPerMinute: 1500,
      },
      { type: 'etherscan', chainId },
      { type: 'blockscoutV2', url: 'https://polygon.blockscout.com/api/v2' },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.POLYGON_POS_DA,
    bridge: {
      value: `${currentValidatorSetSize} validators`,
      sentiment: 'warning',
      description:
        'The bridge verifies that at least 2/3+1 of the Polygon PoS stake has signed off on the checkpoint. The StakeManager contract is the source of truth for the current validator set.',
    },
    mode: DA_MODES.TRANSACTION_DATA,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: RISK_VIEW.DATA_POS,
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, 0),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_ENQUEUE_VIA('L1'),
      description:
        RISK_VIEW.SEQUENCER_ENQUEUE_VIA('L1').description +
        ` In Polygon PoS, the sequencers network corresponds to the PoS validators network, which is composed of ${currentValidatorSetSize} members.`,
    },
    proposerFailure: RISK_VIEW.PROPOSER_POS(
      currentValidatorSetSize,
      currentValidatorSetCap,
    ),
  },
  stateValidation: {
    categories: [
      {
        title: 'No state validation',
        description:
          'State updates are settled on Ethereum if signed by at least 2/3+1 of the Polygon PoS validators stake. Contracts on Ethereum do not check whether the state transitions are valid.',
        references: [],
        risks: [
          {
            category: 'Users can be censored if',
            text: 'validators on Polygon decide to not mint tokens after observing an event on Ethereum.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'validators decide to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'validators submit a fraudulent checkpoint allowing themselves to withdraw all locked funds.',
          },
        ],
      },
    ],
  },
  technology: {
    // dataAvailability: {},
    //operator: {},
    //forceTransactions: {},
    //exitMechanisms: [],
    otherConsiderations: [
      {
        name: 'Destination tokens are upgradeable',
        description:
          'Tokens transferred end up as wrapped ERC20 proxies, some of them are upgradable. The contract is named UChildERC20Proxy.',
        references: [],
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'destination token contract is maliciously upgraded.',
          },
        ],
        isIncomplete: true,
      },
    ],
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('RootChain', {
          description:
            'Contract storing Polygon PoS chain checkpoints. Note that validity of these checkpoints is not verified, it is assumed to be valid if signed by 2/3 of the Polygon Validators.',
          ...upgrades,
        }),
        discovery.getContractDetails(
          'StateSender',
          'Smart contract allowing whitelisted addresses to send messages to contracts on Polygon PoS chain.',
        ),
        discovery.getContractDetails('RootChainManager', {
          description:
            'Main configuration contract to manage tokens, token types, escrows (predicates) for given token types.\
          It also serves as an entry point for deposits and withdrawals effectively acting as a token router.',
          ...upgrades,
        }),
        discovery.getContractDetails('StakeManager', {
          description:
            'Main configuration contract to manage stakers and their voting power and validate checkpoint signatures.',
          ...upgrades,
        }),
        discovery.getContractDetails(
          'StakingInfo',
          'Contains logging and getter functions about staking on Polygon.',
        ),
        discovery.getContractDetails('Registry', {
          description:
            'Maintains the addresses of the contracts used in the system.',
        }),
        discovery.getContractDetails('DepositManager', {
          description:
            'Contract to deposit and escrow ETH, ERC20 or ERC721 tokens. Currently only used for POL.',
          ...upgrades,
        }),
        discovery.getContractDetails('WithdrawManager', {
          description:
            "Contract handling users' withdrawal finalization for tokens escrowed in DepositManager.",
          ...upgrades,
        }),
        discovery.getContractDetails('ERC20PredicateBurnOnly', {
          description:
            'Contract used to initiate ERC20 token withdrawals. The function to handle Plasma proofs is empty, meaning exits cannot be challenged.',
        }),
        discovery.getContractDetails('ERC721PredicateBurnOnly', {
          description:
            'Contract used to initiate ERC721 token withdrawals. The function to handle Plasma proofs is empty, meaning exits cannot be challenged.',
        }),

        discovery.getContractDetails('EventsHub', {
          description: 'Contains events used by other contracts in the system.',
          ...upgrades,
        }),

        discovery.getContractDetails(
          'ExitNFT',
          'NFTs used to represent a withdrawal in the withdrawal PriorityQueue (Only used for tokens initially deposited via DepositManager).',
        ),
        discovery.getContractDetails(
          'Timelock',
          `Contract enforcing delay on code upgrades. The current delay is ${delayString}.`,
        ),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getMultisigPermission(
          'PolygonMultisig',
          'Can propose and execute code upgrades.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
