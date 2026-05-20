import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import type { BaseProject } from '../../types'

const discovery = new ProjectDiscovery('ccip')

export const ccip: BaseProject = {
  id: ProjectId('ccip'),
  slug: 'ccip',
  name: 'Chainlink CCIP',
  shortName: 'CCIP',
  addedAt: UnixTime(1769526436),
  interopConfig: {
    description:
      "Multichain token framework using the CCIP messaging protocol, validated by Chainlink's offchain reporting (OCR) and 'decentralised oracle network' (DON).",
    plugins: [
      {
        plugin: 'ccip',
        bridgeType: 'lockAndMint',
      },
      {
        plugin: 'ccip',
        bridgeType: 'burnAndMint',
      },
      {
        plugin: 'ccip',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'multichain',
    permissions: generateDiscoveryDrivenPermissions([discovery]),
    contracts: {
      addresses: generateDiscoveryDrivenContracts([discovery]),
      risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    },
  },
}
