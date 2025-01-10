import { UnixTime } from '@l2beat/shared-pure'
import { DA_BRIDGES, DA_LAYERS, RISK_VIEW } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { Upgradeability, zkStackL2 } from './templates/zkStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('grvt')
const discovery_ZKstackGovL2 = new ProjectDiscovery(
  'shared-zk-stack',
  'zksync2',
)

export const grvt: Layer2 = zkStackL2({
  discovery,
  discovery_ZKstackGovL2,
  validatorsEvents: {
    added: 'grvtValidatorsAdded',
    removed: 'grvtValidatorsRemoved',
  },
  additionalBadges: [Badge.DA.CustomDA],
  createdAt: new UnixTime(1719931843), // 2024-07-02T14:50:43Z
  additionalPurposes: ['Gaming'],
  display: {
    reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
    name: 'GRVT',
    slug: 'grvt',
    tvlWarning: {
      content:
        'L2BEAT is currently unable to track the TVL of the GRVT Validium due to the lack of a public rpc / explorer.',
      sentiment: 'neutral',
    },
    description:
      'Gravity (GRVT) is a hybrid crypto derivatives exchange, providing a centralized exchange-like experience while being based on the ZK stack Validium codebase with confidential data availability and transaction filtering enabled.',
    links: {
      websites: ['https://grvt.io'],
      apps: ['https://grvt.io/exchange/perpetual/BTC-USDT'],
      documentation: ['https://help.grvt.io/en'], // https://docs.grvt.io/ is private
      explorers: [],
      repositories: [],
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
    riskView: {
      ...RISK_VIEW.DATA_EXTERNAL,
      sources: [
        {
          contract: 'ExecutorFacet',
          references: [
            'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F1#L53',
          ],
        },
      ],
    },
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
          text: 'ExecutorFacet - _commitOneBatch() function',
          href: 'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F1#L53',
        },
      ],
    },
  },
  nonTemplateContracts: (zkStackUpgrades: Upgradeability) => [
    discovery.getContractDetails('GrvtZkEvm', {
      description:
        'The main Rollup contract. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract \
          then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.',
      ...zkStackUpgrades,
    }),
    discovery.getContractDetails('GrvtZkEvmAdmin', {
      description:
        'Intermediary governance contract that has the *ChainAdmin* role in the GRVT zkEVM diamond contract.',
    }),
    discovery.getContractDetails('GRVTBridgeProxy', {
      description:
        "Checks the signature of the DepositApprover for each deposit and, on succeeding, forwards the user's funds and bridging request to the L1SharedBridge contract to deposit to GRVT.",
    }),
    discovery.getContractDetails('GRVTTransactionFilterer', {
      description:
        'Referenced by the mailbox facet of the systems diamond contract, defining a whitelist that gets checked on every call of `requestL2Transaction()`. This prevents non-whitelisted addresses from depositing the gas token and from forcing transactions from L1.',
    }),
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'GrvtChainAdminMultisig',
      'Inherits *ChainAdmin* permissions like adding/removing validators in the ValidatorTimelock, adding a TransactionFilterer that can censor transactions, upgrading the GRVT Diamond to a predeployed version of the ZK stack and settings its fee parameters.',
    ),
    {
      name: 'GrvtOracleEOA',
      accounts: [
        discovery.getPermissionedAccount(
          'GrvtZkEvmAdmin',
          'tokenMultiplierSetter',
        ),
      ],
      description: 'Can set the conversion factor for GBT deposits to GRVT.',
    },
    {
      name: 'DepositApprover',
      accounts: [
        discovery.getPermissionedAccount('GRVTBridgeProxy', 'depositApprover'),
      ],
      description:
        'Permissioned address that must approve each deposit to GRVT.',
    },
    {
      name: 'L2 transaction sender role',
      accounts: discovery.getAccessControlRolePermission(
        'GRVTTransactionFilterer',
        'L2_TX_SENDER_ROLE',
      ),
      description:
        'Whitelisted addresses that are permissioned to deposit via the canonical shared bridge (gated by the GRVTTransactionFilterer).',
    },
  ],
  nonTemplateRiskView: {
    sequencerFailure: {
      value: 'No mechanism',
      description:
        'There is no mechanism to have transactions be included if the sequencer is down or censoring. The Operator actively uses a TransactionFilterer contract, which requires accounts that enqueue or force transactions from L1 to be whitelisted.',
      sentiment: 'bad',
      sources: [
        {
          contract: 'GrvtZkEvm',
          references: [
            'https://etherscan.io/address//0xCDB6228b616EEf8Df47D69A372C4f725C43e718C#code#F1#L240',
            'https://etherscan.io/address//0xE60E94fCCb18a81D501a38959E532C0A85A1be89#code#F1#L95',
          ],
        },
        {
          contract: 'GRVTTransactionFilterer',
          references: [
            'https://etherscan.io/address/0x8319fede99061c6723c86d366a903e8fa3a0f541#code#F1#L29',
          ],
        },
      ],
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
          text: "L1 - L2 interoperability - Developer's documentation",
          href: 'https://docs.zksync.io/zksync-protocol/rollup/l1_l2_communication#priority-operations-1',
        },
        {
          text: 'Mailbox facet',
          href: 'https://etherscan.io/address//0xCDB6228b616EEf8Df47D69A372C4f725C43e718C#code#F1#L240',
        },
        {
          text: 'TransactionFilterer',
          href: 'https://etherscan.io/address/0x8319fede99061c6723c86d366a903e8fa3a0f541#code#F1#L29',
        },
      ],
    },
  },
  milestones: [
    {
      name: 'Mainnet alpha launch',
      link: 'https://grvt.io/blog/grvt-mainnet-alpha-first-hour-15-million/',
      date: '2024-12-20T00:00:00Z',
      description: 'GRVT mainnet alpha launches for all users.',
      type: 'general',
    },
  ],
})
