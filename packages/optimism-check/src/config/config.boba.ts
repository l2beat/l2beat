import { Config } from './Config'

export const config: Config = {
  libAddressManager: '0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089',
  startingPoints: ['OVM_L1CrossDomainMessenger'],
  contracts: {
    OVM_L1CrossDomainMessenger: {
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
    OVM_FraudVerifier: {},
    BondManager: {
      dependencies: ['OVM_Proposer'],
    },
    'ChainStorageContainer-SCC-batches': {
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
