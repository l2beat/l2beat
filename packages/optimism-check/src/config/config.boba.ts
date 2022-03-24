import { Config } from './Config'

export const config: Config = {
  libAddressManager: '0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089',
  startingPoints: ['OVM_L1CrossDomainMessenger'],
  mainBridge: {
    type: 'L1ChugSplashProxy',
    proxyAddress: '0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00',
    implementation: '0xAf41c681143Cb91f218959375f4452A604504833',
    parameters: [
      {
        name: 'messenger',
        type: 'variable',
        description: '',
        abi: 'function messenger() view returns (address)',
      },
      {
        name: 'l2TokenBridge',
        type: 'variable',
        description: '',
        abi: 'function l2TokenBridge() view returns (address)',
      },
    ],
  },
  contracts: {
    OVM_L1CrossDomainMessenger: {
      expectedAddress: '0x12Acf6E3ca96A60fBa0BBFd14D2Fe0EB6ae47820',
      dependencies: ['StateCommitmentChain', 'CanonicalTransactionChain'],
      parameters: [
        {
          name: 'Owner',
          type: 'variable',
          description:
            'Current Owner. Owner can block messages, allow messages, pause relayer.',
          abi: 'function owner() view returns (address)',
        },
      ],
    },
    StateCommitmentChain: {
      expectedAddress: '0xdE7355C971A5B733fe2133753Abd7e5441d441Ec',
      dependencies: [
        'ChainStorageContainer-SCC-batches',
        'OVM_FraudVerifier',
        'BondManager',
        'CanonicalTransactionChain',
        'OVM_Proposer',
      ],
      parameters: [
        {
          name: 'FraudProofWindow',
          type: 'fixed',
          description: '',
          abi: 'function FRAUD_PROOF_WINDOW() view returns (uint256)',
        },
        {
          name: 'SequencerPublishWindow',
          type: 'fixed',
          description: '',
          abi: 'function SEQUENCER_PUBLISH_WINDOW() view returns (uint256)',
        },
      ],
    },
    CanonicalTransactionChain: {
      expectedAddress: '0xfBd2541e316948B259264c02f370eD088E04c3Db',
      dependencies: [
        'OVM_Sequencer',
        'ChainStorageContainer-CTC-batches',
        'ChainStorageContainer-CTC-queue',
      ],
      parameters: [
        {
          name: 'MIN_ROLLUP_TX_GAS',
          value: '100000',
          type: 'constant',
          description: 'This is some parameter',
        },
        {
          name: 'MAX_ROLLUP_TX_SIZE',
          value: '50000',
          type: 'constant',
          description: 'This is some parameter',
        },
        {
          name: 'maxTransactionGasLimit',
          type: 'fixed',
          description: '',
          abi: 'function maxTransactionGasLimit() view returns (uint256)',
        },
        {
          name: 'enqueueGasCost',
          type: 'variable',
          description: '',
          abi: 'function enqueueGasCost() view returns (uint256)',
        },
        {
          name: 'l2GasDiscountDivisor',
          type: 'variable',
          description: '',
          abi: 'function l2GasDiscountDivisor() view returns (uint256)',
        },
        {
          name: 'enqueueL2GasPrepaid',
          type: 'variable',
          description: '',
          abi: 'function enqueueL2GasPrepaid() view returns (uint256)',
        },
      ],
    },
    OVM_FraudVerifier: {
      expectedAddress: '0x872c65c835deB2CFB3493f2C3dD353633Ae4f4B8',
    },
    BondManager: {
      expectedAddress: '0x60660e6CDEb423cf847dD11De4C473130D65b627',
      dependencies: ['OVM_Proposer'],
    },
    'ChainStorageContainer-SCC-batches': {
      expectedAddress: '0x13992B9f327faCA11568BE18a8ad3E9747e87d93',
      parameters: [
        {
          name: 'Owner',
          type: 'fixed',
          description: 'Only owner can use the contract methods.',
          abi: 'function owner() view returns (string)',
        },
      ],
    },
    OVM_Proposer: {},
    OVM_Sequencer: {},
    'ChainStorageContainer-CTC-queue': {
      expectedAddress: '0x5f003030884B3a105809a0Eb0C0C28Ac40ECCD8d',
      parameters: [
        {
          name: 'Owner',
          type: 'fixed',
          description: 'Only owner can use the contract methods.',
          abi: 'function owner() view returns (string)',
        },
      ],
    },
    'ChainStorageContainer-CTC-batches': {
      expectedAddress: '0x17148284d2da2f38c96346f1776C1BF7D7691231',
      parameters: [
        {
          name: 'Owner',
          type: 'fixed',
          description: 'Only owner can use the contract methods.',
          abi: 'function owner() view returns (string)',
        },
      ],
    },
  },
}
