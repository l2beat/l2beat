import { Features, featuresByComparison, Technologies } from '../features'
import { Project } from './Project'

export const arbitrum: Project = {
  name: 'Arbitrum',
  bridges: [
    {
      address: '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
      sinceBlock: 12525700,
      tokens: ['ETH'],
    },
  ],
  details: {
    website: 'https://offchainlabs.com/',
    color: '#4c9ce5',
    technology: {
      name: 'optimistic-rollup',
      details: 'Arbitrum Virtual Machine',
    },
    features: featuresByComparison(Technologies.OptimisticRollup, [
      Features.Generality.Any({
        pointers: [
          'https://developer.offchainlabs.com/docs/rollup_basics#arbitrum-rollup',
        ],
      }),
      Features.Withdrawal.Proved({
        pointers: [
          'https://developer.offchainlabs.com/docs/l1_l2_messages#l2-to-l1-messages-lifecycle',
        ],
      }),
      Features.State.FraudProofs({
        pointers: [
          'https://developer.offchainlabs.com/docs/rollup_basics#executing-and-securing-the-chain',
        ],
      }),
      Features.Settlement.Delayed({
        pointers: [
          'https://developer.offchainlabs.com/docs/inside_arbitrum#rules-for-confirming-or-rejecting-rollup-blocks',
        ],
      }),
      Features.Data.OnChain({
        pointers: [
          'https://developer.offchainlabs.com/docs/rollup_basics#arbitrum-rollup',
        ],
      }),
      Features.SourceCode.Public({
        pointers: [
          'https://github.com/OffchainLabs/arbitrum',
          'https://github.com/OffchainLabs/arb-os',
        ],
      }),
      Features.Upgradeability.Upgradeable({
        pointers: [
          'https://etherscan.io/address/0xc12ba48c781f6e392b49db2e25cd0c28cd77531a#code',
          'https://etherscan.io/address/0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515#code',
        ],
      }),
      Features.Ownership.EOA({
        description:
          'The owner of the bridge is the rollup contract and the owner of the rollup is an EOA.',
        pointers: [
          'https://etherscan.io/address/0x1c7d91ccbdbf378bac0f074678b09cb589184e4e',
        ],
      }),
      Features.SmartContracts.EVM({
        description:
          'Arbitrum has developed its own virtual machine called AVM.',
        pointers: [
          'https://developer.offchainlabs.com/docs/inside_arbitrum#avm-the-arbitrum-virtual-machine',
        ],
      }),
      Features.Sequencer.Centralized({
        pointers: [
          'https://developer.offchainlabs.com/docs/inside_arbitrum#validators',
          'https://developer.offchainlabs.com/docs/inside_arbitrum#if-the-sequencer-is-malicious',
        ],
      }),
      Features.ForceTxs.Any({
        pointers: [
          'https://developer.offchainlabs.com/docs/rollup_basics#aggregating-transactions',
        ],
      }),
    ]),
  },
}
