import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'

import { aztec } from './aztec'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

export const aztecconnect: Layer2 = {
  id: ProjectId('aztecconnect'),
  display: {
    name: 'Aztec Connect',
    slug: 'aztecconnect',
    description:
      'Aztec Connect is an open source layer 2 network that aims to bring scalability and privacy to Ethereum. It strives to enable affordable, private crypto payments via zero-knowledge proofs. Additionally it allows to deposit funds into a variety of DeFi Protocols such as LiDo, Element.Fi, etc.',
    purpose: 'Private DeFi',
    links: {
      websites: ['https://aztec.network/'],
      apps: ['https://zk.money'],
      documentation: ['https://developers.aztec.network/'],
      explorers: ['https://explorer.aztec.network/'],
      repositories: ['https://github.com/AztecProtocol/aztec-2-bug-bounty'],
      socialMedia: [
        'https://twitter.com/aztecnetwork',
        'https://medium.com/aztec-protocol',
        'https://t.me/aztecprotocol',
        'https://discord.gg/UDtJr9u',
        'https://plonk.cafe/',
      ],
    },
  },
  config: {
    escrows: [
      {
        address: '0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455',
        sinceTimestamp: new UnixTime(1654587783),
        tokens: ['ETH', 'DAI', 'wstETH'],
      },
    ],
    events: [
      {
        name: 'RollupProcessed',
        abi: 'event RollupProcessed (uint256 indexed rollupId, bytes32[] nextExpectedDefiHashes, address sender)',
        emitter: EthereumAddress('0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455'),
        type: 'state',
        sinceTimestamp: new UnixTime(1654638194),
      },
      {
        name: 'OffchainData',
        abi: 'event OffchainData(uint256 indexed rollupId, uint256 chunk, uint256 totalChunks, address sender)',
        emitter: EthereumAddress('0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455'),
        type: 'data',
        sinceTimestamp: new UnixTime(1654638194),
      },
    ],
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    upgradeability: {
      value: 'Yes',
      description:
        '1/2 MSig can upgrade or change Validator. 2/15 MSig can pause.',
      sentiment: 'bad',
    },
    sequencerFailure: RISK_VIEW.SEQUENCER_PROPOSE_BLOCKS_ZKP,
    validatorFailure: RISK_VIEW.VALIDATOR_PROPOSE_BLOCKS_ZKP,
  },
  technology: {
    category: 'ZK Rollup',
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'RollupProcessor.sol#L395 - Etherscan source code',
          href: 'https://etherscan.io/address/0x3f972e325cecd99a6be267fd36ceb46dca7c3f28#code#F18#L986',
        },
      ],
    },
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          text: 'StandardVerifier.sol#L37 - Etherscan source code',
          href: 'https://etherscan.io/address/0x07528c46a34d16e4fb7cfa9db7333c521bec8ea2#code#F1#L144',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN,
      references: [
        {
          text: 'RollupProcessor.sol#L359 - Etherscan source code',
          href: 'https://etherscan.io/address/0x3f972e325cecd99a6be267fd36ceb46dca7c3f28#code#F18#L980',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      description:
        'Only specific addresses appointed by the owner are permitted to propose new blocks during regular rollup operation. Periodically a special window is open during which anyone can propose new blocks.',
      references: [
        {
          text: 'RollupProcessor.sol#L97 - Etherscan source code',
          href: 'https://etherscan.io/address/0x3f972e325cecd99a6be267fd36ceb46dca7c3f28#code#F18#L586',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS,
      description:
        FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS.description +
        ' Periodically the rollup opens a special window during which anyone can propose new blocks.',
      references: [
        {
          text: 'RollupProcessor.sol#L347 - Etherscan source code',
          href: 'https://etherscan.io/address/0x3f972e325cecd99a6be267fd36ceb46dca7c3f28#code#F18#L1433',
        },
      ],
    },
    exitMechanisms: [
      {
        name: 'Regular withdraw',
        description:
          'The user initiates the withdrawal by submitting a transaction on L2. When the block containing that transaction is proven on L1 the assets are automatically withdrawn to the user.',
        risks: [],
        references: [
          {
            text: 'RollupProcessor.sol#LL396 - Etherscan source code',
            href: 'https://etherscan.io/address/0x3f972e325cecd99a6be267fd36ceb46dca7c3f28#code#F18#L987',
          },
        ],
      },
    ],
    additionalPrivacy: {
      name: 'Payments are private',
      description:
        'Balances and identities for all tokens on the Aztec rollup are encrypted. Each transaction is encoded as a zkSNARK, protecting user data.',
      risks: [],
      references: [
        {
          text: 'Fast Privacy, Now - Aztec Medium Blog',
          href: 'https://medium.com/aztec-protocol/aztec-zkrollup-layer-2-privacy-1978e90ee3b6#3b25',
        },
      ],
    },
  },
  contracts: {
    addresses: [
      {
        address: '0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455',
        description:
          'Main Rollup contract responsible for deposits, withdrawals and accepting transaction batches alongside zkProof.',
        name: 'RollupProcessor',
        upgradeability: {
          type: 'EIP1967',
          admin: '0xC5b735d05c26579B701Be9bED253Bb588503B26B',
          implementation: '0x3f972e325CecD99a6be267fd36ceB46DCa7C3F28',
        },
      },
      {
        address: '0x4cf32670a53657596E641DFCC6d40f01e4d64927',
        description:
          'Contract responsible for distributing fees and reimbursing gas to Rollup Providers.',
        name: 'AztecFeeDistributor',
      },
      {
        address: '0xA1BBa894a6D39D79C0D1ef9c68a2139c84B81487',
        description: 'Bridge Connector to various DeFi Bridges.',
        name: 'DefiBridgeProxy',
      },
      {
        address: '0x3937f965E824Fe4e7885B8662669821966d3f293',
        description:
          'Standard Plonk zkSNARK Verifier. It can be upgraded by the owner with no delay.',
        name: 'StandardVerifier',
      },
      {
        address: '0x8C3B53F450E53FF14D8C9449465F79ff40668966',
        description: 'Verification Keys for the Verifier.',
        name: 'VerificationKey28x32',
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  news: aztec.news,
}
