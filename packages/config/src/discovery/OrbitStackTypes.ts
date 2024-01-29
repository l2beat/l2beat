import { StackPermissionTemplate } from './StackTemplateTypes'

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
    role: { value: 'EXECUTOR_ROLE', contract: 'UpgradeExecutor' },
    description: 'An actor that can execute upgrade via the UpgradeExecutor.',
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
]
