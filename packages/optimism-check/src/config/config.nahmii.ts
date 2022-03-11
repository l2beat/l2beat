import { Config } from './Config'

export const config: Config = {
  libAddressManager: '0x7934915C03eA2E2C4D69c269F45598B738ddee08',
  startingPoints: ['NVM_L1CrossDomainMessenger'],
  contracts: {
    NVM_L1CrossDomainMessenger: {
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
    'NVM_ChainStorageContainer-message-queue': {},
    NVM_SafetyChecker: {},
    NVM_L2CrossDomainMessenger: {},
    NVM_FraudVerifier: {},
    NVM_L2MessageRelayer: {},
    NVM_Sequencer: {},
  },
}
