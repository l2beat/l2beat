import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const lifi: BaseProject = {
  id: ProjectId('lifi'),
  slug: 'lifi',
  name: 'LI.FI',
  shortName: undefined,
  addedAt: UnixTime(1780394699),
  interopConfig: {
    description:
      'Intent protocol implemented by LI.FI, based on the Open Intents Framework (OIF).',
    plugins: [
      {
        plugin: 'lifi-intents',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
  },
}
