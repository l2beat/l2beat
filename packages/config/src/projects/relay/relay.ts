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
        value: 'Request refund',
        sentiment: 'bad',
        description:
          'There is no onchain refund option. No self-serve onchain refund path is exposed; failed transfers depend on Relay-operated recovery.',
      },
      solverAccess: {
        value: 'Internal',
        sentiment: 'bad',
        description: 'Transfers are filled by Relay-operated infrastructure.',
      },
      settlement: {
        value: 'Internal',
        sentiment: 'bad',
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
