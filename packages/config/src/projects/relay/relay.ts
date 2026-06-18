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
        value: 'Intent framework',
        description:
          'Routes transfers through a relay-style execution network.',
      },
      userRecovery: {
        value: 'Needs research',
        description:
          'Confirm whether users can cancel or refund a transfer that is not filled.',
      },
      solverAccess: {
        value: 'Internal',
        description: 'Transfers are filled by Relay-operated infrastructure.',
      },
      settlement: {
        value: 'Relay Oracle',
        description:
          'Settlement depends on Relay’s centralized oracle and allocator flow.',
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
