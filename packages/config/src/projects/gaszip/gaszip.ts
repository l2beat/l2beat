import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const gaszip: BaseProject = {
  id: ProjectId('gaszip'),
  slug: 'gaszip',
  name: 'Gas.zip',
  shortName: undefined,
  addedAt: UnixTime(1769070497),
  interopConfig: {
    description:
      'Intent-based centralised EOA bridge used for gas token transfers, optimised for speed and diverse chain support.',
    plugins: [
      {
        plugin: 'gaszip',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
  },
}
