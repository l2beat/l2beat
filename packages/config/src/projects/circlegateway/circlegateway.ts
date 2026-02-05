import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const circlegateway: BaseProject = {
  id: ProjectId('circlegateway'),
  slug: 'circlegateway',
  name: 'Circle Gateway',
  shortName: 'Gateway',
  addedAt: UnixTime(1770115878),
  interopConfig: {
    bridgeType: 'omnichain',
    transfersTimeMode: 'unknown',
    plugins: [
      {
        plugin: 'circle-gateway',
      },
    ],
  },
  isInteropProtocol: true,
}
