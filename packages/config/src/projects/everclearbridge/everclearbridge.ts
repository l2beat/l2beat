import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { BaseProject } from '../../types'

const _discovery = new ProjectDiscovery('everclearbridge')

export const everclearbridge: BaseProject = {
  id: ProjectId('everclearbridge'),
  slug: 'everclearbridge',
  name: 'Everclear',
  shortName: undefined,
  addedAt: UnixTime(1742199959),
  // TODO: add interop plugin
  // TODO!: when added, remove it from filter in config.test.ts
  // isInteropProtocol: true,
}
