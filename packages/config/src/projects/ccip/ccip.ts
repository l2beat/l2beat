import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

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
  },
}
