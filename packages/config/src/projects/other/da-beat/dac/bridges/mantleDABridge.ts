import { ChainId } from '@l2beat/shared-pure'
import { immutablex } from '../../../../layer2s/immutablex'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { toUsedInProject } from '../../utils/to-used-in-project'

/**
 * THIS IS EXAMPLE DATA FOR SKETCH PURPOSES
 */
export const mantleDABridge = {
  id: 'mantleDABridge',
  type: 'DAC',
  display: {
    name: 'mantleDABridge',
    slug: 'mantle-da-bridge',
    description: 'MantleDA bridge on Ethereum.',
    links: {
        websites: ['https://mantle.xyz'],
        documentation: [
          'https://docs.mantle.xyz/network/introduction/concepts/data-availability'
        ],
        repositories: [
          'https://github.com/mantlenetworkio'
        ],
        apps: [],
        explorers: ['https://explorer.mantle.xyz/mantle-da'],
        socialMedia: ['https://twitter.com/0xMantle', 'https://t.me/mantlenetwork'],
      },
  },
  contracts: {
    addresses: [],
    risks: [],
  },
  technology:
    'Some note about the technology used by the bridge.\n## Markdown supported',
  permissions: [],
  chain: ChainId.ETHEREUM,
  requiredMembers: 5,
  totalMembers: 7,
  usedIn: toUsedInProject([immutablex]),
  risks: {
    attestations: DaAttestationSecurityRisk.NotVerified,
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.LowOrNoDelay(),
  },
} satisfies DaBridge
