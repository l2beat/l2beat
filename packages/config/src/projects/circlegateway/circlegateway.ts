import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const circlegateway: BaseProject = {
  id: ProjectId('circlegateway'),
  slug: 'circlegateway',
  name: 'Circle Gateway',
  shortName: 'Gateway',
  addedAt: UnixTime(1770115878),
  interopConfig: {
    transfersTimeMode: 'unknown',
    plugins: [
      {
        plugin: 'circle-gateway',
        bridgeType: 'burnAndMint',
      },
    ],
  },
  isInteropProtocol: true,
}
