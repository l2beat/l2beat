import { UnixTime } from '@l2beat/shared-pure'
import { DA_BRIDGES, DA_LAYERS, RISK_VIEW } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { zkStackL2 } from '../../templates/zkStack'

const discovery = new ProjectDiscovery('grvt')

export const grvt: ScalingProject = zkStackL2({
  discovery,
  additionalBadges: [BADGES.DA.CustomDA],
  addedAt: UnixTime(1719931843), // 2024-07-02T14:50:43Z
  additionalPurposes: ['Gaming'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  display: {
    name: 'GRVT',
    slug: 'grvt',
    tvlWarning: {
      value:
        'L2BEAT is currently unable to track the TVL of the GRVT Validium due to the lack of a public rpc / explorer.',
      sentiment: 'neutral',
    },
    description:
      'Gravity (GRVT) is a hybrid crypto derivatives exchange, providing a centralized exchange-like experience while being based on the ZK stack Validium codebase with confidential data availability and transaction filtering enabled.',
    links: {
      websites: ['https://grvt.io'],
      apps: ['https://grvt.io/exchange/perpetual/BTC-USDT'],
      documentation: ['https://help.grvt.io/en'], // https://docs.grvt.io/ is private
      socialMedia: [
        'https://x.com/grvt_io',
        'https://discord.gg/3jsVPwaGeB',
        'https://grvt.io/blog/',
      ],
    },
  },
  diamondContract: discovery.getContract('GrvtZkEvm'),
  daProvider: {
    layer: DA_LAYERS.NONE,
    bridge: DA_BRIDGES.NONE,
    riskView: RISK_VIEW.DATA_EXTERNAL,
    technology: {
      name: 'Data is not stored on chain',
      description:
        'The transaction data is not recorded on the Ethereum main chain. Transaction data is stored off-chain and only the hashes are posted onchain by the centralized Sequencer.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the external data becomes unavailable.',
          isCritical: true,
        },
      ],
      references: [
        {
          title: 'ExecutorFacet - _commitOneBatch() function',
          url: 'https://etherscan.io/address//0x53d0b421BB3e522632ABEB06BB2c4eB15eaD9800#code#F1#L46',
        },
      ],
    },
  },
  nonTemplateRiskView: {
    sequencerFailure: {
      value: 'No mechanism',
      description:
        'There is no mechanism to have transactions be included if the sequencer is down or censoring. The Operator actively uses a TransactionFilterer contract, which requires accounts that enqueue or force transactions from L1 to be whitelisted.',
      sentiment: 'bad',
    },
  },
  nonTemplateTechnology: {
    forceTransactions: {
      name: "Users can't force any transaction",
      description:
        'If a user is censored by the L2 Sequencer, they cannot by default force their transaction via the L1 queue. An an active TransactionFilterer contract which allows only whitelisted accounts to enqueue, prevents it. Even if a user was specifically whitelisted, there is no mechanism that forces L2 Sequencer to include\
            transactions from the queue in an L2 block.',
      risks: [
        {
          category: 'Users can be censored if',
          text: 'the operator refuses to include their transactions.',
        },
        {
          category: 'Users can be censored if',
          text: 'the Operator does not specifically whitelist them in the TransactionFilterer.',
        },
      ],
      references: [
        {
          title: "L1 - L2 interoperability - Developer's documentation",
          url: 'https://docs.zksync.io/zksync-protocol/rollup/l1_l2_communication#priority-operations-1',
        },
        {
          title: 'Mailbox facet',
          url: 'https://etherscan.io/address//0x36b026c39125964D99596CE302866B5A59E4dE27#code#F1#L441',
        },
        {
          title: 'TransactionFilterer',
          url: 'https://etherscan.io/address/0x8319fede99061c6723c86d366a903e8fa3a0f541#code#F1#L29',
        },
      ],
    },
  },
  milestones: [
    {
      title: 'Mainnet alpha launch',
      url: 'https://grvt.io/blog/grvt-mainnet-alpha-first-hour-15-million/',
      date: '2024-12-20T00:00:00Z',
      description: 'GRVT mainnet alpha launches for all users.',
      type: 'general',
    },
  ],
})
