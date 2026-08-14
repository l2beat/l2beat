import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('debridge')

export const debridge: BaseProject = {
  id: ProjectId('debridge'),
  slug: 'debridge',
  name: 'deBridge',
  shortName: undefined,
  addedAt: UnixTime(1673362295),
  // this is only the debridge messaging and token bridge
  interopConfig: {
    description:
      'deBridge is a message bridge and lock-and-mint token bridge. Cross-chain submissions are authorized by ECDSA signatures from a fixed validator set (8-of-12 on Ethereum) verified onchain; all core contracts are upgradable by a deBridge multisig without delay.',
    detailedDescription: readProjectMarkdown('debridge', 'detailedDescription'),
    name: 'deBridge',
    plugins: [
      {
        plugin: 'debridge',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'other',
    permissions: generateDiscoveryDrivenPermissions([discovery]),
    contracts: {
      addresses: generateDiscoveryDrivenContracts([discovery]),
      risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    },
  },
}
