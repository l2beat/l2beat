import { Features, featuresByComparison, risk, Technologies } from '../features'
import { Project } from './Project'

export const hermez: Project = {
  name: 'Hermez',
  bridges: [
    {
      address: '0xA68D85dF56E733A06443306A095646317B5Fa633',
      sinceBlock: 12093596,
      tokens: ['DAI', 'ETH', 'LINK', 'UNI', 'USDC', 'USDT', 'WBTC', 'YFI'],
    },
  ],
  details: {
    website: 'https://hermez.io/',
    color: '#ff9933',
    technology: {
      name: 'zk-rollup',
      details: 'zk-SNARK',
    },
    features: featuresByComparison(Technologies.ZkRollup, [
      Features.Generality.Specific({
        pointers: ['https://docs.hermez.io/#/about/scalability?id=background'],
      }),
      Features.Withdrawal.Proved({
        description:
          'Additonally if funds exceed certain treshold the withdrawal is delayed to prevent attacks. In case an attack is determined to occur the funds go to governance instead.',
        pointers: [
          'https://docs.hermez.io/#/developers/glossary?id=exit-tree',
          'https://docs.hermez.io/#/developers/protocol/withdrawal-delayer/withdrawal-delayer',
        ],
        risks: [
          risk(
            'Funds can be stolen',
            'The governance can claim an attack is underway and confiscate user funds.'
          ),
        ],
      }),
      Features.State.ValidityProofs({
        pointers: ['https://docs.hermez.io/#/about/security?id=zk-proofs'],
      }),
      Features.Settlement.Delayed({
        description:
          'In case of Hermez the delay comes from the attack protection placed on withdrawals.',
        pointers: [
          'https://docs.hermez.io/#/developers/protocol/withdrawal-delayer/withdrawal-delayer',
        ],
      }),
      Features.Cryptography.SNARKS({
        pointers: [
          'https://docs.hermez.io/#/about/security?id=multi-party-computation-for-the-trusted-setup',
        ],
      }),
      Features.Data.OnChain({
        pointers: [
          'https://docs.hermez.io/#/about/scalability?id=zero-knowledge-rollups',
        ],
      }),
      Features.SourceCode.Public({
        pointers: ['https://github.com/hermeznetwork/contracts'],
      }),
      Features.Upgradeability.Upgradeable({
        pointers: [
          'https://etherscan.io/address/0xa68d85df56e733a06443306a095646317b5fa633',
        ],
      }),
      Features.Sequencer.Decentralized({
        pointers: ['https://docs.hermez.io/#/about/model?id=auction'],
      }),
      Features.ForceTxs.Any({
        pointers: [
          'https://docs.hermez.io/#/faq/end-users?id=can-coordinators-censor-transactions',
        ],
      }),
    ]),
    news: [
      {
        name: 'Hermez Network Mainnet Launch on 4th of March 2021',
        link: 'https://blog.hermez.io/hermez-network-mainnet-launch/',
      },
    ],
  },
}
