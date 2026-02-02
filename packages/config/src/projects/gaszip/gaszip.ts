import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const gaszip: BaseProject = {
  id: ProjectId('gaszip'),
  slug: 'gaszip',
  name: 'Gas.zip',
  shortName: undefined,
  addedAt: UnixTime(1769070497),
  interop: {
    configs: [
      {
        bridgeType: 'nonMinting',
        plugins: [
          {
            plugin: 'gaszip',
          },
        ],
      },
    ],
  },
  isInteropProtocol: true,
}
