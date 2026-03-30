import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { BaseProject } from '../../types'

const _discovery = new ProjectDiscovery('hop')

export const hop: BaseProject = {
  id: ProjectId('hop'),
  slug: 'hop',
  name: 'Hop',
  shortName: undefined,
  addedAt: UnixTime(1662628329),
  // TODO: add plugin
  // TODO!: when added, remove it from filter in config.test.ts
  // isInteropProtocol: true,
}
