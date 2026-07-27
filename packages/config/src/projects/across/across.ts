import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('across')

const bondAmountFmt = discovery.getContractValue<string>(
  'HubPool',
  'bondAmountFmt',
)
const finalizationDelayFmt = discovery.getContractValue<string>(
  'HubPool',
  'finalizationDelayFmt',
)

export const across: BaseProject = {
  id: ProjectId('across'),
  slug: 'across',
  name: 'Across',
  shortName: undefined,
  addedAt: UnixTime(1712746402),
  interopConfig: {
    description:
      'Intent framework specialised on popular chains and assets, speed and security.',
    intent: {
      color: '#1E88E5',
      intentModel: {
        value: 'Intent framework',
        description:
          'Relayers compete to fill cross-chain transfer intents across supported chains and assets.',
      },
      userRecovery: {
        value: 'Slow-fill fallback',
        description:
          'If no relayer fast-fills a deposit, Across can complete it through the protocol slow-fill path. This is not available for chains without an Ethereum canonical bridge adapter.',
      },
      solverAccess: {
        value: 'Permissionless',
        description: 'Relayers compete to fill deposits and receive repayment.',
      },
      settlement: {
        value: 'Optimistic',
        description:
          'Relayer repayment is settled through the Across system and can be escalated to token voting via UMA.',
      },
    },
    detailedDescription: readProjectMarkdown('across', 'detailedDescription', {
      bondAmountFmt,
      finalizationDelayFmt,
    }),
    plugins: [
      {
        plugin: 'across',
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
