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
