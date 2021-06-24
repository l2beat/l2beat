import { Features, featuresByComparison, Technologies } from '../features'
import { Project } from './Project'

export const deversifi: Project = {
  name: 'DeversiFi',
  bridges: [
    {
      address: '0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b',
      sinceBlock: 10141009,
      tokens: [
        'ETH',
        'USDT',
        'WBTC',
        'USDC',
        'DAI',
        'LDO',
        'CEL',
        'cUSDT',
        'PNK',
        'AAVE',
        'SUSHI',
        'YFI',
        'UNI',
        'ZRX',
        'HEZ',
        'DUSK',
        'LINK',
        'MKR',
        'MLN',
        'NEC',
        'COMP',
        'SNX',
        'BAL',
        'LRC',
        'OMG',
        'BAT',
      ],
    },
  ],
  details: {
    website: 'https://www.deversifi.com/',
    color: '#17b5cb',
    showNotL2Warning: true,
    technology: {
      name: 'validium',
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
          'https://etherscan.io/address/0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b#code',
        ],
        value: 'Yes, through contract upgrade',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip: 'Only DeversiFi can produce new blocks',
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
          'https://etherscan.io/address/0x28780349a33eee56bb92241baab8095449e24306#code#F1#L63',
        ],
      }),
      Features.SourceCode.Public({
        pointers: ['https://github.com/starkware-libs/starkex-contracts'],
      }),
      Features.Upgradeability.Timelock({
        description: 'The system enforces a 4 week delay on upgrades.',
        pointers: [
          'https://etherscan.io/address/0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b',
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
        name: 'Say Hello to the New DeversiFi - powered by StarkWare!',
        link: 'https://blog.deversifi.com/introducing-deversifi2-0/',
      },
    ],
  },
}
