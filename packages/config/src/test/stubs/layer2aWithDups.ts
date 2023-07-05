import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import {
  DATA_AVAILABILITY,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
} from '../../layer2s/common'
import { Layer2 } from '../../layer2s/types'

export const layer2aWithDups: Layer2 = {
  type: 'layer2',
  id: ProjectId('layer2a'),
  display: {
    name: 'Layer2a',
    slug: 'layer2a',
    description: '',
    purpose: 'Universal',
    provider: 'Optimism',
    category: 'Optimistic Rollup',
    links: {
      websites: [],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: [],
    },
  },
  config: {
    escrows: [],
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_FP,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: RISK_VIEW.SEQUENCER_ENQUEUE_VIA_L1,
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    sourceUpgradeability: RISK_VIEW.UPGRADABLE_YES,
  },
  technology: {
    stateCorrectness: {
      name: 'Fraud proofs are in development',
      description:
        'Ultimately, Layer2a will use interactive fraud proofs to enforce state correctness. This feature is currently in development and the system permits invalid state roots.',
      risks: [],
      references: [],
    },
    dataAvailability: { ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL },
    operator: { ...OPERATOR.CENTRALIZED_SEQUENCER },
    forceTransactions: { ...FORCE_TRANSACTIONS.CANONICAL_ORDERING },
    exitMechanisms: [],
    smartContracts: {
      name: '',
      description: '',
      risks: [],
      references: [],
    },
  },
  permissions: [
    {
      name: 'Layer2a MultiSig',
      accounts: [
        {
          address: EthereumAddress(
            '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
          ),
          type: 'MultiSig',
        },
      ],
      description: '',
    },
    {
      name: 'Duplicate Layer2a MultiSig',
      accounts: [
        {
          address: EthereumAddress(
            '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
          ),
          type: 'MultiSig',
        },
      ],
      description: '',
    },
    {
      name: 'Duplicate CanonicalTransactionChain',
      accounts: [
        {
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
      accounts: [
        {
          address: EthereumAddress(
            '0x3041BA32f451F5850c147805F5521AC206421623',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x3bC453E5b3c941D1baD8F25E512772a50eE20AC1',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x6709Ef8aDCEA465f673dEA5b1a774a79BBCb4EAa',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x7904c69A27026A9Ff2CC2C8f5A917c018a46C613',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x7cB07FE039a92B3D784f284D919503A381BEC54f',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa',
          ),
          type: 'EOA',
        },
        {
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
      accounts: [
        {
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
      accounts: [
        {
          address: EthereumAddress(
            '0x473300df21D047806A082244b417f96b32f13A33',
          ),
          type: 'EOA',
        },
      ],
      description: '',
    },
  ],
  contracts: {
    addresses: [
      {
        address: EthereumAddress('0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e'),
        name: 'Duplicate ForeignAMB Proxy',
        upgradeability: {
          type: 'Custom',
          admin: EthereumAddress('0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6'),
          implementation: EthereumAddress(
            '0x82B67a43b69914E611710C62e629dAbB2f7AC6AB',
          ),
        },
      },
      {
        name: 'CanonicalTransactionChain',
        address: EthereumAddress('0x5E4e65926BA27467555EB562121fac00D24E9dD2'),
      },
      {
        name: 'Duplicate CanonicalTransactionChain',
        address: EthereumAddress('0x5E4e65926BA27467555EB562121fac00D24E9dD2'),
      },
      {
        name: 'StateCommitmentChain',
        address: EthereumAddress('0xBe5dAb4A2e9cd0F27300dB4aB94BeE3A233AEB19'),
      },
      {
        name: 'ChainStorageContainer-CTC-batches',
        address: EthereumAddress('0xD16463EF9b0338CE3D73309028ef1714D220c024'),
      },
      {
        name: 'ChainStorageContainer-SCC-batches',
        address: EthereumAddress('0xb0ddFf09c4019e31960de11bD845E836078E8EbE'),
      },
      {
        name: 'BondManager',
        address: EthereumAddress('0xcd626E1328b41fCF24737F137BcD4CE0c32bc8d1'),
      },
      {
        name: 'L1CrossDomainMessenger',
        address: EthereumAddress('0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1'),
        upgradeability: {
          type: 'EIP1967 proxy',
          admin: EthereumAddress('0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A'),
          implementation: EthereumAddress(
            '0xd9166833FF12A5F900ccfBf2c8B62a90F1Ca1FD5',
          ),
        },
      },
      {
        name: 'Lib_AddressManager',
        address: EthereumAddress('0xdE1FCfB0851916CA5101820A69b13a4E276bd81F'),
      },
      {
        name: 'L1StandardBridge',
        address: EthereumAddress('0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1'),
        upgradeability: {
          type: 'EIP1967 proxy',
          admin: EthereumAddress('0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A'),
          implementation: EthereumAddress(
            '0x40E0C049f4671846E9Cff93AAEd88f2B48E527bB',
          ),
        },
      },
      {
        name: 'SynthetixBridgeToLayer2a',
        address: EthereumAddress('0xCd9D4988C0AE61887B075bA77f08cbFAd2b65068'),
      },
      {
        name: 'SynthetixBridgeEscrow',
        address: EthereumAddress('0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f'),
      },
      {
        name: 'L1DaiGateway',
        address: EthereumAddress('0x10E6593CDda8c58a1d0f14C5164B376352a55f2F'),
      },
      {
        name: 'L1Escrow',
        address: EthereumAddress('0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65'),
      },
    ],
    risks: [],
  },
}
