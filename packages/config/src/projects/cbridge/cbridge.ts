import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../..'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'

const _discovery = new ProjectDiscovery('cbridge')

export const cbridge: BaseProject = {
  id: ProjectId('cbridge'),
  slug: 'cbridge',
  name: 'Celer cBridge',
  shortName: 'cBridge',
  addedAt: UnixTime(1662628329),
  // TODO: add to FE
  // TODO!: when added, remove it from filter in config.test.ts
  // interopConfig: {
  //   plugins: [
  //     {
  //       plugin: 'cbridge',
  //       bridgeType: 'nonMinting',
  //     },
  //   ],
  //   type: 'intent',
  // },
  // isInteropProtocol: true,
}
