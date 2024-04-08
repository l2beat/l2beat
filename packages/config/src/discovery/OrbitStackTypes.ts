import { StackPermissionTemplate } from './StackTemplateTypes'

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
  {
    role: { value: 'validators.0', contract: 'RollupProxy' },
    description:
      'They can submit new state roots and challenge state roots. Some of the operators perform their duties through special purpose smart contracts.',
  },
  {
    role: { value: 'batchPosters.0', contract: 'SequencerInbox' },
    description: 'Central actors allowed to submit transaction batches to L1.',
  },
  // TODO(radomski): Permission part of the templates need a rewrite, because
  // it's a mess and it's impossible to solve this situtation.
  //
  // - Two contracts are EXECUTOR_ROLE at UpgradeExecutor.
  // - One is an EOA and the other is a Multisig.
  // - Let the permission for the Multisig inhert the contract name from the discovery.
  // - Override the name of the EOA.
  //
  // Currently, trying to override the EXECUTOR_ROLE will merge these two into
  // a single contract removing the EOA.
  // {
  //   role: { value: 'EXECUTOR_ROLE', contract: 'UpgradeExecutor' },
  //   description: 'An actor that can execute upgrade via the UpgradeExecutor.',
  // },
]
