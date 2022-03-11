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
      expectedAddress: '0xd9166833FF12A5F900ccfBf2c8B62a90F1Ca1FD5',
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
      expectedAddress: '0xBe5dAb4A2e9cd0F27300dB4aB94BeE3A233AEB19',
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
      expectedAddress: '0x5E4e65926BA27467555EB562121fac00D24E9dD2',
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
      expectedAddress: '0x042065416C5c665dc196076745326Af3Cd840D15',
    },
    BondManager: {
      expectedAddress: '0xcd626E1328b41fCF24737F137BcD4CE0c32bc8d1',
      dependencies: ['OVM_Proposer'],
    },
    'ChainStorageContainer-SCC-batches': {
      expectedAddress: '0xb0ddFf09c4019e31960de11bD845E836078E8EbE',
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
      expectedAddress: '0xD16463EF9b0338CE3D73309028ef1714D220c024',
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
