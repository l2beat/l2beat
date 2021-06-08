import { Project } from './Project'

export const loopring: Project = {
  name: 'Loopring',
  bridges: [
    {
      address: '0x674bdf20A0F284D710BC40872100128e2d66Bd3f',
      sinceBlock: 11149779,
      tokens: ['DAI', 'ETH', 'LINK', 'LRC', 'MKR', 'USDC', 'USDT', 'WBTC'],
    },
  ],
  details: {
    website: 'https://loopring.org',
    color: '#1c42ff',
    technology: {
      name: 'zk-rollup',
      details: 'zk-SNARK',
    },
    parameters: [
      {
        name: 'Primary use case',
        value: 'DEX',
      },
      {
        name: 'Hypothetical level of decentralization',
        sentiment: 'good',
        value: 'High',
      },
      {
        name: 'Current level of decentralization',
        sentiment: 'good',
        value: 'High',
      },
      {
        name: 'Can funds be stolen by the operator?',
        sentiment: 'good',
        value: 'No',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip: 'Only operator can produce new blocks',
        pointers: [
          'https://github.com/Loopring/protocols/blob/bbcebc4848b4a1c5ba8264a2d601de5f8183b5aa/packages/loopring_v3/contracts/core/impl/ExchangeV3.sol#L340',
        ],
        value: 'No',
      },
      {
        name: 'Force TX mechanism?',
        sentiment: 'good',
        tooltip: 'If operator goes dark users can still exit the rollup',
        pointers: [
          'https://github.com/Loopring/protocols/blob/adc95a13ab4d84ff50a99f601ba1c6b5add7e411/packages/loopring_v3/DESIGN.md#forced-request-handling',
          'https://github.com/Loopring/protocols/blob/adc95a13ab4d84ff50a99f601ba1c6b5add7e411/packages/loopring_v3/DESIGN.md#withdrawal-mode',
        ],
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
  },
}
