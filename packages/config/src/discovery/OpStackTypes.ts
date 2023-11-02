export type OpStackContractName =
  | 'L2OutputOracle'
  | 'OptimismPortal'
  | 'SystemConfig'
  | 'L1CrossDomainMessenger'

export type OpStackPermissionName = 'Sequencer' | 'Proposer' | 'ProxyAdmin'

export interface OPStackContractTemplate {
  name: OpStackContractName
  coreDescription: string
}

export interface OPStackPermissionTemplate {
  role: { value: string; contract: string }
  description: string
}

export const OP_STACK_CONTRACT_DESCRIPTION: OPStackContractTemplate[] = [
  {
    name: 'L2OutputOracle',
    coreDescription:
      'The {0} contract contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.',
  },
  {
    name: 'OptimismPortal',
    coreDescription:
      'The {0} contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals.',
  },
  {
    name: 'SystemConfig',
    coreDescription:
      'It contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.',
  },
  {
    name: 'L1CrossDomainMessenger',
    coreDescription:
      "The {0} (L1xDM) contract sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.",
  },
]

export const OP_STACK_PERMISSION_TEMPLATES: OPStackPermissionTemplate[] = [
  {
    role: { value: 'owner', contract: 'AddressManager' },
    description: 'Owner of {0}.',
  },
  {
    role: { value: 'admin', contract: 'OptimismPortal' },
    description: 'Admin of {0}.',
  },
  {
    role: { value: 'admin', contract: 'SystemConfig' },
    description: 'Admin of {0}.',
  },
  {
    role: { value: 'admin', contract: 'L2OutputOracle' },
    description: 'Admin of {0}.',
  },
  {
    role: { value: 'admin', contract: 'L1ERC721Bridge' },
    description: 'Admin of {0}.',
  },
  {
    role: { value: 'admin', contract: 'OptimismMintableERC20Factory' },
    description: 'Admin of {0}.',
  },
  {
    role: { value: 'admin', contract: 'L1StandardBridge' },
    description: 'Admin of {0}.',
  },
  {
    role: { value: 'batcherHash', contract: 'SystemConfig' },
    description: 'Central actor allowed to commit L2 transactions to L1.',
  },
  {
    role: { value: 'PROPOSER', contract: 'L2OutputOracle' },
    description: 'Central actor allowed to post new L2 state roots to L1.',
  },
  {
    role: { value: 'CHALLENGER', contract: 'L2OutputOracle' },
    description:
      'Central actor allowed to delete L2 state roots proposed by a Proposer.',
  },
  {
    role: { value: 'GUARDIAN', contract: 'OptimismPortal' },
    description: 'Central actor allowed to pause deposits and withdrawals.',
  },
]
