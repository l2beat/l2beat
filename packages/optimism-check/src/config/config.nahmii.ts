import { Config } from './Config'

export const config: Config = {
  libAddressManager: '0x7934915C03eA2E2C4D69c269F45598B738ddee08',
  startingPoints: ['NVM_L1CrossDomainMessenger'],
  mainBridge: {
    type: 'L1ChugSplashProxy',
    proxyAddress: '0x2fce9b92a64c1ddf14a1a9e5ec6d4e4c7c9f4fdd',
    implementation: '0xF46655caD8C7dB3719AF4Eb9CFdAC0987985080c',
  },
  contracts: {
    NVM_L1CrossDomainMessenger: {
      expectedAddress: '0x0e14f07BCdCacEC46677DFf02685f049A7c3928C',
      dependencies: [
        'NVM_MessageQueue',
        'NVM_L2CrossDomainMessenger',
        'NVM_FraudVerifier',
        'NVM_L2MessageRelayer',
        'NVM_Sequencer',
      ],
      parameters: [
        {
          name: 'Owner',
          type: 'variable',
          description: '',
          abi: 'function owner() view returns (address)',
        },
      ],
    },
    NVM_MessageQueue: {
      expectedAddress: '0xAC92b09965B6AAc33Dd43f3Ce752aD79b74Ddb94',
      dependencies: [
        'NVM_ChainStorageContainer-message-queue',
        'NVM_SafetyChecker',
      ],
      parameters: [
        {
          name: 'L2GasDiscountDivisor',
          type: 'fixed',
          description: '',
          abi: 'function L2_GAS_DISCOUNT_DIVISOR() view returns (uint256)',
        },
        {
          name: 'MaxRollupTxSize',
          type: 'fixed',
          description: '',
          abi: 'function MAX_ROLLUP_TX_SIZE() view returns (uint256)',
        },
        {
          name: 'MinRollupTxGas',
          type: 'fixed',
          description: '',
          abi: 'function MIN_ROLLUP_TX_GAS() view returns (uint256)',
        },
        {
          name: 'forceInclusionPeriodBlocks',
          type: 'variable',
          description: '',
          abi: 'function forceInclusionPeriodBlocks() view returns (uint256)',
        },
        {
          name: 'forceInclusionPeriodSeconds',
          type: 'variable',
          description: '',
          abi: 'function forceInclusionPeriodSeconds() view returns (uint256)',
        },
        {
          name: 'maxTransactionGasLimit',
          type: 'variable',
          description: '',
          abi: 'function maxTransactionGasLimit() view returns (uint256)',
        },
      ],
    },
    'NVM_ChainStorageContainer-message-queue': {
      expectedAddress: '0x72dDa4F7d131035F523728F11FAe0D7ccbA67128',
    },
    NVM_SafetyChecker: {},
    NVM_L2CrossDomainMessenger: {},
    NVM_FraudVerifier: {
      expectedAddress: '0xC0E090e6988FF9d5C471a2106A2cb176b4949E6C',
    },
    NVM_L2MessageRelayer: {},
    NVM_Sequencer: {},
  },
}
