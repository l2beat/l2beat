import { DaAccessibilityRisk, DaExitWindowRisk } from '../../../types'
import { DaAttestationSecurityRisk } from '../../../types/DaAttestationSecurityRisk'
import { DaBridge, EnshrinedBridge } from '../../../types/DaBridge'
import { linkByDA } from '../../../utils/link-by-da'

export const enshrinedBridge: EnshrinedBridge = {
  id: 'enshrined-bridge',
  type: 'Enshrined',
  display: {
    name: 'Enshrined Bridge',
    slug: 'enshrined-bridge',
    description: 'The DA bridge on Ethereum is enshrined.',
    links: {
      websites: [],
      documentation: [],
      repositories: [],
      apps: [],
      explorers: [],
      socialMedia: [],
    },
  },
  technology: {
    description: `
    The DA bridge on Ethereum is enshrined, meaning that blob data is directly accessible on the consensus layer, with data availability guaranteed by the network's inherent consensus rules. 
    If a block contains unavailable data, full nodes will reject it, causing the chain to fork away from that block. This ensures data availability without requiring additional trust assumptions. 
    In contrast, external DA providers must rely on data availability attestations from the external validator set, introducing an extra layer of trust on the majority of validators.
    `,
  },
  usedIn: linkByDA({
    // To catch both blobs and calldata suffix
    layer: (layer) => layer?.startsWith('Ethereum'),
    bridge: (bridge) => bridge === 'Enshrined',
  }),
  risks: {
    accessibility: DaAccessibilityRisk.Enshrined,
    attestations: DaAttestationSecurityRisk.Enshrined,
    exitWindow: DaExitWindowRisk.Enshrined,
    // we should add a note on the frontend that the specific rollup contracts could be upgradable and the security properties of each depend on the single rollup implementation
  },
} satisfies DaBridge
