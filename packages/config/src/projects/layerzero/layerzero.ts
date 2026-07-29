import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('layerzero')

export const layerzero: BaseProject = {
  id: ProjectId('layerzero'),
  slug: 'layerzero',
  name: 'LayerZero',
  shortName: undefined,
  addedAt: UnixTime(1769421770),
  interopConfig: {
    description:
      'LayerZero OFT (omnichain fungible token) is a multichain token framework built on the modular, highly customizable LayerZero messaging protocol. While it theoretically supports any form of validation, ~100% of messages are validated by multisig-like smart contracts called DVNs ("Decentralized" Validator Networks). The protocol supports a vast set of EVM and non-EVM destinations.',
    detailedDescription: readProjectMarkdown(
      'layerzero',
      'detailedDescription',
    ),
    isAggregate: true,
    plugins: [
      {
        plugin: 'layerzero-v2-ofts',
        bridgeType: 'burnAndMint',
      },
      {
        plugin: 'layerzero-v2-ofts',
        bridgeType: 'lockAndMint',
      },
      {
        plugin: 'layerzero-v2-ofts',
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
