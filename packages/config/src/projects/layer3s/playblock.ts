import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { AnytrustDAC } from '../other/da-beat/templates/anytrust-template'
import { DacTransactionDataType } from '../other/da-beat/types'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('playblock', 'nova')

const dac = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')
const { membersCount, requiredSignatures } = dac

export const playblock: Layer3 = orbitStackL3({
  createdAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  discovery,
  hostChain: ProjectId('nova'),
  additionalBadges: [Badge.DA.DAC, Badge.L3ParentChain.Nova, Badge.RaaS.Gelato],
  additionalPurposes: ['Gaming'],
  display: {
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
      REASON_FOR_BEING_OTHER.SMALL_DAC,
    ],
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    name: 'PlayBlock',
    slug: 'playblock',
    description:
      'PlayBlock is an Orbit stack Layer 3 on Arbitrum Nova. It is built by the team behind Playnance, and is focused on gasless gaming and gambling.',
    links: {
      websites: ['https://playnance.com/'],
      apps: [],
      documentation: [],
      explorers: ['https://explorer.playblock.io/'],
      repositories: ['https://github.com/playnance-games/PlayBlock'],
      socialMedia: ['https://twitter.com/Playnancetech'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  // not on coingecko
  // gasTokens: ['PBG'],
  // associatedTokens: ['PBG'],
  rpcUrl: 'https://playnance.drpc.org/',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplatePermissions: [
    {
      name: 'RollupOwnerEOA',
      accounts: discovery.getAccessControlRolePermission(
        'UpgradeExecutor',
        'EXECUTOR_ROLE',
      ),
      description:
        'This address has the Executor role and can upgrade the rollup contracts (via ProxyAdmin) without delay, potentially stealing all funds.',
    },
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('ProxyAdmin', {
      description:
        'This contract can upgrade the implementations of the rollup proxies.',
    }),
  ],
  dataAvailabilitySolution: AnytrustDAC({
    display: {
      name: 'PlayBlock',
      slug: 'playblock',
    },
    bridge: {
      createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
      requiredMembers: requiredSignatures,
      membersCount: membersCount,
      transactionDataType: DacTransactionDataType.TransactionDataCompressed,
    },
  }),
})
