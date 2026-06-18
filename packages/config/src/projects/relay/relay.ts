import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const RELAY_DETAILED_DESCRIPTION = readProjectMarkdown(
  'relay',
  'detailedDescription',
)

export const relay: BaseProject = {
  id: ProjectId('relay'),
  slug: 'relay',
  name: 'Relay',
  shortName: undefined,
  aliases: ['Reservoir'],
  addedAt: UnixTime(1769070497),
  interopConfig: {
    description:
      'Intent-based centralized EOA bridge optimised for speed, multichain and multiasset support.',
    detailedDescription: RELAY_DETAILED_DESCRIPTION,
    intent: {
      intentModel: {
        value: 'Solver relay',
        description:
          'Routes transfers through a relay-style execution network.',
      },
      userRecovery: {
        value: 'Route-dependent',
        description:
          'Recovery depends on the selected route and execution path.',
      },
      solverAccess: {
        value: 'Relay network',
        description: 'Execution is coordinated by Relay infrastructure.',
      },
      settlement: {
        value: 'Route-dependent',
        description: 'Settlement follows the chosen Relay route.',
      },
    },
    plugins: [
      {
        plugin: 'relay',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
  },
}
