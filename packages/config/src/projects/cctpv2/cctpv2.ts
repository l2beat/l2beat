import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const cctpv2: BaseProject = {
  id: ProjectId('cctpv2'),
  slug: 'cctpv2',
  name: 'CCTP v2',
  shortName: undefined,
  addedAt: UnixTime(1769070497),
  interop: {
    configs: [
      {
        bridgeType: 'omnichain',
        plugins: [
          {
            plugin: 'cctp-v2',
          },
        ],
      },
    ],
  },
  isInteropProtocol: true,
}
