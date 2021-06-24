import { Features, featuresByComparison, Technologies } from '../features'
import { Project } from './Project'

export const immutablex: Project = {
  name: 'ImmutableX',
  bridges: [
    {
      address: '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9',
      sinceBlock: 12011518,
      tokens: ['ETH'],
    },
  ],
  details: {
    website: 'https://www.immutable.com/',
    color: '#17b5cb',
    showNotL2Warning: true,
    technology: {
      name: 'validium',
      details: 'zk-STARK/StarkExchange',
    },
    parameters: [
      {
        name: 'Primary use case',
        value: 'NFT Exchange',
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
          'https://etherscan.io/address/0x5FDCCA53617f4d2b9134B29090C87D01058e27e9#code',
        ],
        value: 'Yes, through contract upgrade',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip: 'Only ImmutableX can produce new blocks',
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
    features: featuresByComparison(Technologies.Validium, [
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
      Features.Data.OffChain({
        pointers: [
          'https://etherscan.io/address/0x16ba0f221664a5189cf2c1a7af0d3abfc70aa295#code#F1#L63',
        ],
      }),
      Features.SourceCode.Public({
        pointers: ['https://github.com/starkware-libs/starkex-contracts'],
      }),
      Features.Upgradeability.Upgradeable({
        pointers: [
          'https://etherscan.io/address/0x5FDCCA53617f4d2b9134B29090C87D01058e27e9',
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
        name: 'Immutable X Launches Gas-Free Layer-2 Solution Paving the Way to Mainstream NFT Adoption',
        link: 'https://www.immutable.com/blog/immutable-x-alpha-trading-launch',
      },
    ],
  },
}
