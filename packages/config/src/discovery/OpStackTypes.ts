import type { StackPermissionTemplate } from './StackTemplateTypes'

export type OpStackContractName =
  | 'L2OutputOracle'
  | 'OptimismPortal'
  | 'SystemConfig'
  | 'L1CrossDomainMessenger'
  | 'L1StandardBridge'
  | 'L1ERC721Bridge'

interface OPStackContractTemplate {
  name: OpStackContractName
  coreDescription: string
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
  {
    name: 'L1StandardBridge',
    coreDescription:
      'The {0} contract is the main entry point to deposit ERC20 tokens from L1 to L2.',
  },
  {
    name: 'L1ERC721Bridge',
    coreDescription:
      'The {0} contract is used to bridge ERC-721 tokens from L1 to L2.',
  },
]

export const OP_STACK_PERMISSION_TEMPLATES: StackPermissionTemplate[] = [
  {
    role: { value: 'owner', contract: 'AddressManager' },
    tags: ['owner'],
  },
  {
    role: { value: '$admin', contract: 'OptimismPortal' },
    tags: ['admin'],
  },
  {
    role: { value: '$admin', contract: 'SystemConfig' },
    tags: ['admin'],
  },
  {
    role: { value: '$admin', contract: 'L2OutputOracle' },
    tags: ['admin'],
  },
  {
    role: { value: '$admin', contract: 'L1ERC721Bridge' },
    tags: ['admin'],
  },
  {
    role: { value: '$admin', contract: 'OptimismMintableERC20Factory' },
    tags: ['admin'],
  },
  {
    role: { value: '$admin', contract: 'L1StandardBridge' },
    tags: ['admin'],
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
