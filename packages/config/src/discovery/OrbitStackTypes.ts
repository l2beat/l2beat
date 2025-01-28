import type { StackPermissionTemplate } from './StackTemplateTypes'

export type OrbitStackContractName =
  | 'RollupProxy'
  | 'Bridge'
  | 'SequencerInbox'
  | 'Inbox'
  | 'Outbox'
  | 'UpgradeExecutor'
  | 'ChallengeManager'
  | 'OneStepProofEntry'
  | 'OneStepProverMemory'
  | 'OneStepProverMath'
  | 'OneStepProverHostIo'
  | 'OneStepProver0'

export interface OrbitStackContractTemplate {
  name: OrbitStackContractName
  coreDescription: string
}

export const ORBIT_STACK_CONTRACT_DESCRIPTION: OrbitStackContractTemplate[] = [
  {
    name: 'RollupProxy',
    coreDescription:
      'Main contract implementing Arbitrum One Rollup. Manages other Rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.',
  },
  {
    name: 'Bridge',
    coreDescription:
      'Contract managing Inboxes and Outboxes. It escrows the native token used for gas on the chain.',
  },
  {
    name: 'SequencerInbox',
    coreDescription:
      'Main entry point for the Sequencer submitting transaction batches.',
  },
  {
    name: 'Inbox',
    coreDescription:
      'Entry point for users depositing ETH and sending L1 -> L2 messages.',
  },
  {
    name: 'Outbox',
    coreDescription:
      'Contract that allows L2->L1 calls, i.e. messages initiated on L2 which eventually resolve in execution on L1.',
  },
  {
    name: 'UpgradeExecutor',
    coreDescription: 'Contract allowed to upgrade the system.',
  },
  {
    name: 'ChallengeManager',
    coreDescription:
      'Contract that allows challenging invalid state roots. Can be called through the RollupProxy.',
  },
  {
    name: 'OneStepProofEntry',
    coreDescription: 'Contract used to perform the last step of a fraud proof.',
  },
  {
    name: 'OneStepProverMemory',
    coreDescription: 'Contract used to perform the last step of a fraud proof.',
  },
  {
    name: 'OneStepProverMath',
    coreDescription: 'Contract used to perform the last step of a fraud proof.',
  },
  {
    name: 'OneStepProverHostIo',
    coreDescription: 'Contract used to perform the last step of a fraud proof.',
  },
  {
    name: 'OneStepProver0',
    coreDescription: 'Contract used to perform the last step of a fraud proof.',
  },
]

export const ORBIT_STACK_PERMISSION_TEMPLATES: StackPermissionTemplate[] = [
  {
    role: { value: 'admin', contract: 'UpgradeExecutor' },
    tags: ['admin'],
  },
  {
    role: { value: 'admin', contract: 'RollupEventInbox' },
    tags: ['admin'],
  },
  {
    role: { value: 'admin', contract: 'ChallengeManager' },
    tags: ['admin'],
  },
  {
    role: { value: 'admin', contract: 'Outbox' },
    tags: ['admin'],
  },
  {
    role: { value: 'admin', contract: 'L1CustomGateway' },
    tags: ['admin'],
  },
  {
    role: { value: 'admin', contract: 'L1ERC20Gateway' },
    tags: ['admin'],
  },
  {
    role: { value: 'admin', contract: 'Bridge' },
    tags: ['admin'],
  },
  {
    role: { value: 'admin', contract: 'SequenceInbox' },
    tags: ['admin'],
  },
  {
    role: { value: 'admin', contract: 'L1GatewayRouter' },
    tags: ['admin'],
  },
  {
    role: { value: 'admin', contract: 'Inbox' },
    tags: ['admin'],
  },
]
