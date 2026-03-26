import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

const chainId = 4217

export const tempo: BaseProject = {
  id: ProjectId('tempo'),
  slug: 'tempo',
  name: 'Tempo',
  shortName: 'Tempo',
  addedAt: UnixTime.fromDate(new Date('2023-01-01')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description: 'EVM-compatible Layer 1.',
    links: {},
    badges: [],
  },
  chainConfig: {
    name: 'tempo',
    chainId,
    explorerUrl: 'https://explore.tempo.xyz',
    apis: [{ type: 'rpc', url: 'https://1rpc.io/tempo' }],
  },
}
