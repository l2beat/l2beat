/* 
Resolved OVM_L1CrossDomainMessenger to 0xd9166833FF12A5F900ccfBf2c8B62a90F1Ca1FD5
Resolved CanonicalTransactionChain to 0x5E4e65926BA27467555EB562121fac00D24E9dD2
Resolved ChainStorageContainer-CTC-batches to 0xD16463EF9b0338CE3D73309028ef1714D220c024
Resolved OVM_Sequencer to 0x6887246668a3b87F54DeB3b94Ba47a6f63F32985
Resolved StateCommitmentChain to 0xBe5dAb4A2e9cd0F27300dB4aB94BeE3A233AEB19
Resolved OVM_Proposer to 0x473300df21D047806A082244b417f96b32f13A33
Resolved BondManager to 0xcd626E1328b41fCF24737F137BcD4CE0c32bc8d1
Resolved OVM_FraudVerifier to 0x042065416C5c665dc196076745326Af3Cd840D15
Resolved ChainStorageContainer-SCC-batches to 0xb0ddFf09c4019e31960de11bD845E836078E8EbE
*/


export type Parameter = ConstantParameter | FixedParameter | VariableParameter

export interface ConstantParameter {
  type: 'constant',
  name: string,
  description?: string,
  value: string | number
} 

export interface FixedParameter {
  type: 'fixed',
  name: string,
  description?: string,
  abi: string,
}

export interface VariableParameter {
  type: 'variable',
  name: string,
  description?: string,
  abi: string,
}

export interface ContractDescription {
  dependencies?: string[],
  parameters?: Parameter[],              // optional
}

//type AbiEntry = string | { type: 'array'; method: string }

export interface Config {
  [name: string]: ContractDescription
}

export const config: Config = {
  'OVM_L1CrossDomainMessenger': {
    dependencies: [
      'StateCommitmentChain',
      'CanonicalTransactionChain',
    ],
    parameters: [],
  },
  'StateCommitmentChain': {
    dependencies: [
      'ChainStorageContainer-SCC-batches',
      'OVM_FraudVerifier',
      'BondManager',
      'CanonicalTransactionChain',
      'OVM_Proposer'
    ],
    parameters: [
      {name: 'FraudProofWindow', type: 'fixed', description: '', abi:'function FRAUD_PROOF_WINDOW() view returns (uint256)'},
    ],
  },
  'CanonicalTransactionChain': {
    dependencies: [
      'OVM_Sequencer',
      'ChainStorageContainer-CTC-batches',
    ],
    parameters: [
      {name: 'MIN_ROLLUP_TX_GAS', value: '100000', type: 'constant', description: 'This is some parameter'},
      {name: 'MAX_ROLLUP_TX_SIZE', value: '50000', type: 'constant', description: 'This is some parameter'},
      {name: 'maxTransactionGasLimit', type: 'fixed', description: '', abi:'function maxTransactionGasLimit() view returns (uint256)'},
      {name: 'enqueueGasCost', type: 'variable', description: '', abi:'function enqueueGasCost() view returns (uint256)'},
      {name: 'l2GasDiscountDivisor', type: 'variable', description: '', abi:'function l2GasDiscountDivisor() view returns (uint256)'},
      {name: 'enqueueL2GasPrepaid', type: 'variable', description: '', abi:'function enqueueL2GasPrepaid() view returns (uint256)'},
    ]
  },
  'OVM_FraudVerifier': {
  },
  'BondManager': {
  },
  'ChainStorageContainer-SCC-batches': {
  },
  'OVM_Proposer': {
  },
  'OVM_Sequencer': {
  },
  'ChainStorageContainer-CTC-batches': {
  },
}
