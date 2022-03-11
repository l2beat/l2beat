import { Config } from './Config'

export const config: Config = {
  libAddressManager: '0x918778e825747a892b17C66fe7D24C618262867d',
  startingPoints: ['OVM_L1CrossDomainMessenger'],
  mainBridge: {
    type: 'L1ChugSplashProxy',
    proxyAddress: '0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b',
    implementation: '0xa0cfE8Af2AB5C9232714647702DbACf862EA4798',
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
      {
        name: 'addressMgr',
        type: 'variable',
        description: '',
        abi: 'function addressmgr() view returns (address)',
      },
      {
        name: 'metis',
        type: 'variable',
        description: '',
        abi: 'function metis() view returns (address)',
      },
      {
        name: 'defaultChainId',
        type: 'variable',
        description: '',
        abi: 'function DEFAULT_CHAINID() view returns (uint256)',
      },
    ],
  },
  contracts: {
    OVM_L1CrossDomainMessenger: {
      expectedAddress: '0x8bF439ef7167023F009E24b21719Ca5f768Ecb36',
      dependencies: [
        'StateCommitmentChain',
        'MVM_DiscountOracle',
        'CanonicalTransactionChain',
      ],
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
      expectedAddress: '0xf209815E595Cdf3ed0aAF9665b1772e608AB9380',
      dependencies: [
        'ChainStorageContainer-SCC-batches',
        '1088_MVM_FraudVerifier',
        'METIS_MANAGER',
        'BondManager',
        'CanonicalTransactionChain',
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
        {
          name: 'DefaultChainId',
          type: 'fixed',
          description: '',
          abi: 'function DEFAULT_CHAINID() view returns (uint256)',
        },
      ],
    },
    CanonicalTransactionChain: {
      expectedAddress: '0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9',
      dependencies: [
        '1088_OVM_Sequencer',
        '1088_MVM_Sequencer',
        'OVM_Sequencer',
        'MVM_SuperManager',
        'ChainStorageContainer-CTC-batches',
        'ChainStorageContainer-CTC-queue',
        'Proxy__OVM_L1CrossDomainMessenger',
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
    MVM_DiscountOracle: {
      expectedAddress: '0xC8953ca384b4AdC8B1b11B030Afe2F05471664b0',
      dependencies: ['1088_MVM_Sequencer'],
      parameters: [
        {
          name: 'discount',
          type: 'variable',
          description: '',
          abi: 'function getDiscount() view returns (uint256)',
        },
        {
          name: 'minL2Gas',
          type: 'variable',
          description: '',
          abi: 'function getMinL2Gas() view returns (uint256)',
        },
        {
          name: 'ConfigOwnerKey',
          type: 'fixed',
          description: '',
          abi: 'function CONFIG_OWNER_KEY() view returns (string)',
        },
      ],
    },
    OVM_FraudVerifier: {},
    MVM_SuperManager: {},
    '1088_OVM_Sequencer': {},
    '1088_MVM_Sequencer': {},
    Proxy__OVM_L1CrossDomainMessenger: {
      expectedAddress: '0x081D1101855bD523bA69A9794e0217F0DB6323ff',
    },
    METIS_MANAGER: {},
    '1088_MVM_FraudVerifier': {
      expectedAddress: '0x5fF5316CD1C015970eEC83D34a69E504B577a5bb',
    },
    BondManager: {
      expectedAddress: '0xf51B9C9a1c12e7E48BEC15DC358D0C1f0d7Eb3be',
      dependencies: ['OVM_Proposer'],
    },
    'ChainStorageContainer-SCC-batches': {
      expectedAddress: '0x10739F09f6e62689c0aA8A1878816de9e166d6f9',
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
      expectedAddress: '0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57',
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
      expectedAddress: '0x38473Feb3A6366757A249dB2cA4fBB2C663416B7',
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
