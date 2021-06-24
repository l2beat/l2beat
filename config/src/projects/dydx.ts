import { Features, featuresByComparison, Technologies } from '../features'
import { Project } from './Project'

export const dydx: Project = {
  name: 'dYdX',
  bridges: [
    {
      address: '0xD54f502e184B6B739d7D27a6410a67dc462D69c8',
      sinceBlock: 11834295,
      tokens: ['USDC'],
    },
  ],
  details: {
    website: 'https://dydx.exchange/',
    color: '#6966ff',
    technology: {
      name: 'zk-rollup',
      details: 'zk-STARK/StarkExchange',
    },
    parameters: [
      {
        name: 'Primary use case',
        value: 'DEX',
      },
      {
        name: 'Hypothetical level of decentralization',
        value: 'High',
      },
      {
        name: 'Current level of decentralization',
        tooltip: 'Contracts are upgradable',
        sentiment: 'bad',
        value: 'Low',
      },
      {
        name: 'Can funds be stolen by the operator?',
        tooltip: 'Contracts are upgradable',
        sentiment: 'neutral',
        pointers: [
          'https://etherscan.io/address/0xD54f502e184B6B739d7D27a6410a67dc462D69c8#code',
        ],
        value: 'Yes, through contract upgrade',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip: 'Only dydx can produce new blocks',
        value: 'No',
      },
      {
        name: 'Force TX mechanism?',
        sentiment: 'good',
        value: 'Yes but only for withdrawals',
      },
      {
        name: 'Privacy',
        value: 'No',
      },
      {
        name: 'Smart contracts',
        value: 'No',
      },
    ],
    features: featuresByComparison(Technologies.ZkRollup, [
      Features.Generality.Specific({
        pointers: [
          'https://docs.starkware.co/starkex-docs-v2/overview#system-components',
        ],
      }),
      Features.Withdrawal.Proved({
        pointers: [
          'https://docs.starkware.co/starkex-docs-v2/starkex-deep-dive/smart-contracts-1/in-spot-trading/in-perpetual-trading#escape',
          'https://docs.starkware.co/starkex-docs-v2/starkex-deep-dive/smart-contracts-1/in-spot-trading/in-spot-trading#escape',
        ],
      }),
      Features.State.ValidityProofs({
        pointers: [
          'https://docs.starkware.co/starkex-docs-v2/starkex-deep-dive/off-chain-state#enforcing-consistency-on-the-on-chain-state',
        ],
      }),
      Features.Settlement.AfterProof({
        pointers: [
          'https://docs.starkware.co/starkex-docs-v2/starkex-deep-dive/smart-contracts-1/public-interactions#withdrawal',
        ],
      }),
      Features.Cryptography.STARKS({
        pointers: [
          'https://docs.starkware.co/starkex-docs-v2/crypto/stark-curve',
        ],
      }),
      // TODO: add pointers
      Features.Data.OnChain(),
      Features.SourceCode.Public({
        pointers: ['https://github.com/starkware-libs/starkex-contracts'],
      }),
      Features.Upgradeability.Upgradeable({
        pointers: [
          'https://etherscan.io/address/0xD54f502e184B6B739d7D27a6410a67dc462D69c8',
        ],
      }),
      // TODO: Features.Ownership
      Features.Sequencer.Centralized({
        pointers: [
          'https://docs.starkware.co/starkex-docs-v2/starkex-deep-dive/smart-contracts-1/contract-management#operator',
        ],
      }),
      Features.ForceTxs.WithdrawalsOnly({
        description: 'Perpetuals also support forced trade',
        pointers: [
          'https://docs.starkware.co/starkex-docs-v2/starkex-deep-dive/smart-contracts-1/in-spot-trading/in-perpetual-trading',
          'https://docs.starkware.co/starkex-docs-v2/starkex-deep-dive/smart-contracts-1/in-spot-trading/in-spot-trading',
        ],
      }),
    ]),
    news: [
      {
        name: 'Trade now on Layer 2',
        link: 'https://dydx.exchange/blog/public',
      },
    ],
  },
}
