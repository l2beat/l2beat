import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import type { BaseProject } from '../../types'

const discovery = new ProjectDiscovery('butternetwork')

export const butternetwork: BaseProject = {
  id: ProjectId('butternetwork'),
  slug: 'butternetwork',
  name: 'Butter Network',
  shortName: 'Butter',
  addedAt: UnixTime(1785915246),
  interopConfig: {
    description:
      'Multichain bridge and messaging protocol using the MAP relay chain and its light-client network to verify cross-chain messages. Butter supports both lock/release and token burn/mint flows depending on the configured asset.',
    plugins: [
      { plugin: 'butternetwork', bridgeType: 'lockAndMint' },
      { plugin: 'butternetwork', bridgeType: 'burnAndMint' },
      { plugin: 'butternetwork', bridgeType: 'nonMinting' },
    ],
    type: 'multichain',
    permissions: generateDiscoveryDrivenPermissions([discovery]),
    contracts: {
      addresses: generateDiscoveryDrivenContracts([discovery]),
      risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    },
  },
}
