import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const circlegateway: BaseProject = {
  id: ProjectId('circlegateway'),
  slug: 'circlegateway',
  name: 'Circle Gateway',
  shortName: 'Gateway',
  addedAt: UnixTime(1770115878),
  interopConfig: {
    description:
      'Chain abstraction protocol built by Circle. Used mainly for USDC, users can deposit to get an offchain balance, that can then be used on any chain that is natively supported by Circle USDC.',
    transfersTimeMode: 'unknown',
    plugins: [
      {
        plugin: 'circle-gateway',
        bridgeType: 'burnAndMint',
      },
    ],
    type: 'multichain',
  },
}
