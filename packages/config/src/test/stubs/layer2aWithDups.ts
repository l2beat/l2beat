import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import type { ScalingProject } from '../../internalTypes'

export const layer2aWithDups = {
  type: 'layer2',
  id: ProjectId('layer2a'),
  addedAt: UnixTime(1723722996), // 2024-08-15T11:56:36Z
  capability: 'universal',
  display: {
    name: 'Layer2a',
    slug: 'layer2a',
    description: '',
    purposes: ['Universal'],
    stack: 'OP Stack',
    category: 'Optimistic Rollup',
    links: {},
    finality: {
      warnings: {
        timeToInclusion: {
          sentiment: 'neutral',
          value:
            "It's assumed that transaction data batches are submitted sequentially.",
        },
      },
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [
      {
        // this is an old version, so it is not visible on frontend
        address: EthereumAddress('0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f'),
        contract: {
          name: 'SynthetixBridgeEscrow',
          isVerified: true,
          chain: 'ethereum',
        },
        sinceTimestamp: UnixTime(1609459200),
        tokens: ['SNX'],
        chain: 'ethereum',
      },
      {
        // this is a new version, so it is visible on frontend and should be included in verification script output
        address: EthereumAddress('0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65'),
        contract: {
          name: 'L1Escrow',
          isVerified: true,
          chain: 'ethereum',
        },
        sinceTimestamp: UnixTime(1609459200),
        tokens: ['SNX'],
        chain: 'ethereum',
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_FP,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW_UNKNOWN,
    sequencerFailure: RISK_VIEW.SEQUENCER_ENQUEUE_VIA('L1'),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP,
  },
  stateValidation: {
    categories: [
      {
        title: 'Fraud proofs',
        description:
          'Ultimately, Layer2a will use interactive fraud proofs to enforce state correctness. This feature is currently in development and the system permits invalid state roots.',
        risks: [],
        references: [],
      },
    ],
  },
  technology: {
    dataAvailability: { ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CANONICAL },
    operator: { ...OPERATOR.CENTRALIZED_SEQUENCER },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING('smart contract'),
    },
    exitMechanisms: [],
    otherConsiderations: [
      {
        name: '',
        description: '',
        risks: [],
        references: [],
      },
    ],
  },
  permissions: {
    ethereum: {
      actors: [
        {
          name: 'Layer2a MultiSig',
          chain: 'ethereum',
          accounts: [
            {
              isVerified: true,
              address: EthereumAddress(
                '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
              ),
              type: 'Contract',
            },
          ],
          description: '',
        },
        {
          name: 'Duplicate Layer2a MultiSig',
          chain: 'ethereum',
          accounts: [
            {
              isVerified: true,
              address: EthereumAddress(
                '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
              ),
              type: 'Contract',
            },
          ],
          description: '',
        },
        {
          name: 'Duplicate CanonicalTransactionChain',
          chain: 'ethereum',
          accounts: [
            {
              isVerified: true,
              address: EthereumAddress(
                '0x5E4e65926BA27467555EB562121fac00D24E9dD2',
              ),
              type: 'Contract',
            },
          ],
          description: '',
        },
        {
          name: 'MultiSig participants',
          chain: 'ethereum',
          accounts: [
            {
              isVerified: true,
              address: EthereumAddress(
                '0x3041BA32f451F5850c147805F5521AC206421623',
              ),
              type: 'EOA',
            },
            {
              isVerified: true,
              address: EthereumAddress(
                '0x3bC453E5b3c941D1baD8F25E512772a50eE20AC1',
              ),
              type: 'EOA',
            },
            {
              isVerified: true,
              address: EthereumAddress(
                '0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15',
              ),
              type: 'EOA',
            },
            {
              isVerified: true,
              address: EthereumAddress(
                '0x6709Ef8aDCEA465f673dEA5b1a774a79BBCb4EAa',
              ),
              type: 'EOA',
            },
            {
              isVerified: true,
              address: EthereumAddress(
                '0x7904c69A27026A9Ff2CC2C8f5A917c018a46C613',
              ),
              type: 'EOA',
            },
            {
              isVerified: true,
              address: EthereumAddress(
                '0x7cB07FE039a92B3D784f284D919503A381BEC54f',
              ),
              type: 'EOA',
            },
            {
              isVerified: true,
              address: EthereumAddress(
                '0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa',
              ),
              type: 'EOA',
            },
            {
              isVerified: true,
              address: EthereumAddress(
                '0xA902A27a7631D502E3Ec17fc5d4c3e0861752c94',
              ),
              type: 'EOA',
            },
          ],
          description: '',
        },
        {
          name: 'Sequencer',
          chain: 'ethereum',
          accounts: [
            {
              isVerified: true,
              address: EthereumAddress(
                '0x6887246668a3b87F54DeB3b94Ba47a6f63F32985',
              ),
              type: 'EOA',
            },
          ],
          description: '',
        },
        {
          name: 'State Root Proposer',
          chain: 'ethereum',
          accounts: [
            {
              isVerified: true,
              address: EthereumAddress(
                '0x473300df21D047806A082244b417f96b32f13A33',
              ),
              type: 'EOA',
            },
          ],
          description: '',
        },
      ],
    },
  },
  contracts: {
    addresses: {
      ethereum: [
        {
          address: EthereumAddress(
            '0xB37D31b2A74029B5951a2778F959282E2D518595',
          ),
          name: 'L2 Contract',
          chain: 'optimism',
          isVerified: true,
        },
        {
          address: EthereumAddress(
            '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
          ),
          chain: 'ethereum',
          name: 'Duplicate ForeignAMB Proxy',
          upgradeability: {
            proxyType: 'Custom',
            admins: [
              EthereumAddress('0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6'),
            ],
            implementations: [
              EthereumAddress('0x82B67a43b69914E611710C62e629dAbB2f7AC6AB'),
            ],
          },
          isVerified: true,
        },
        {
          name: 'CanonicalTransactionChain',
          address: EthereumAddress(
            '0x5E4e65926BA27467555EB562121fac00D24E9dD2',
          ),
          chain: 'ethereum',
          isVerified: true,
        },
        {
          name: 'Duplicate CanonicalTransactionChain',
          address: EthereumAddress(
            '0x5E4e65926BA27467555EB562121fac00D24E9dD2',
          ),
          chain: 'ethereum',
          isVerified: true,
        },
        {
          name: 'StateCommitmentChain',
          address: EthereumAddress(
            '0xBe5dAb4A2e9cd0F27300dB4aB94BeE3A233AEB19',
          ),
          chain: 'ethereum',
          isVerified: true,
        },
        {
          name: 'ChainStorageContainer-CTC-batches',
          address: EthereumAddress(
            '0xD16463EF9b0338CE3D73309028ef1714D220c024',
          ),
          chain: 'ethereum',
          isVerified: true,
        },
        {
          name: 'ChainStorageContainer-SCC-batches',
          address: EthereumAddress(
            '0xb0ddFf09c4019e31960de11bD845E836078E8EbE',
          ),
          chain: 'ethereum',
          isVerified: true,
        },
        {
          name: 'BondManager',
          address: EthereumAddress(
            '0xcd626E1328b41fCF24737F137BcD4CE0c32bc8d1',
          ),
          chain: 'ethereum',
          isVerified: true,
        },
        {
          name: 'L1CrossDomainMessenger',
          address: EthereumAddress(
            '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1',
          ),
          chain: 'ethereum',
          upgradeability: {
            proxyType: 'EIP1967 proxy',
            admins: [
              EthereumAddress('0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A'),
            ],
            implementations: [
              EthereumAddress('0xd9166833FF12A5F900ccfBf2c8B62a90F1Ca1FD5'),
            ],
          },
          isVerified: true,
        },
        {
          name: 'Lib_AddressManager',
          address: EthereumAddress(
            '0xdE1FCfB0851916CA5101820A69b13a4E276bd81F',
          ),
          chain: 'ethereum',
          isVerified: true,
        },
        {
          name: 'L1StandardBridge',
          address: EthereumAddress(
            '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
          ),
          chain: 'ethereum',
          upgradeability: {
            proxyType: 'EIP1967 proxy',
            admins: [
              EthereumAddress('0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A'),
            ],
            implementations: [
              EthereumAddress('0x40E0C049f4671846E9Cff93AAEd88f2B48E527bB'),
            ],
          },
          isVerified: true,
        },
        {
          name: 'SynthetixBridgeToLayer2a',
          address: EthereumAddress(
            '0xCd9D4988C0AE61887B075bA77f08cbFAd2b65068',
          ),
          chain: 'ethereum',
          isVerified: true,
        },
        {
          name: 'L1DaiGateway',
          address: EthereumAddress(
            '0x10E6593CDda8c58a1d0f14C5164B376352a55f2F',
          ),
          chain: 'ethereum',
          isVerified: true,
        },
      ],
    },
    risks: [],
  },
} as unknown as ScalingProject
