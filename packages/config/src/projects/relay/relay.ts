import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const relay: BaseProject = {
  id: ProjectId('relay'),
  slug: 'relay',
  name: 'Relay',
  shortName: undefined,
  addedAt: UnixTime(1769070497),
  interopConfig: {
    description:
      'Intent-based centralized EOA bridge optimised for speed, multichain and multiasset support.',
    plugins: [
      {
        plugin: 'relay',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
  },
}
