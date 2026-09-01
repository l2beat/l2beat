import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('fusionplus')

export const fusionplus: BaseProject = {
  id: ProjectId('fusionplus'),
  slug: 'fusionplus',
  name: '1inch Fusion+',
  shortName: undefined,
  addedAt: UnixTime(1770021647),
  interopConfig: {
    description: 'HTLC-like cross-chain intent protocol built by 1inch.',
    detailedDescription: readProjectMarkdown(
      'fusionplus',
      'detailedDescription',
    ),
    intent: {
      color: '#6D5EF6',
      intentModel: {
        value: 'Intent framework',
        description:
          'A resolver fills a user order through matching source- and destination-chain escrows.',
      },
      userRecovery: {
        value: 'Resolver cancellation',
        sentiment: 'bad',
        description:
          'The filling resolver, or later a RES holder, must cancel the source-chain escrow to return the deposit to the user.',
      },
      solverAccess: {
        value: 'Whitelist / NFT',
        sentiment: 'bad',
        description:
          'Orders use timed resolver whitelists, followed by access for owner-issued RES NFT holders.',
      },
      settlement: {
        value: 'HTLC-like',
        description:
          'Matching escrows use one secret and separate source- and destination-chain timelocks.',
      },
    },
    plugins: [
      {
        plugin: 'oneinch-fusion-plus',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
    permissions: generateDiscoveryDrivenPermissions([discovery]),
    contracts: {
      addresses: generateDiscoveryDrivenContracts([discovery]),
      risks: [],
    },
  },
}
