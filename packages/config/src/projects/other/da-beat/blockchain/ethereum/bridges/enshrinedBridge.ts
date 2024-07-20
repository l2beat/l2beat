import { DaAccessibilityRisk, DaExitWindowRisk } from '../../../types'
import { DaAttestationSecurityRisk } from '../../../types/DaAttestationSecurityRisk'
import {
  DaBridge,
  DaBridgeKind,
  EnshrinedBridge,
} from '../../../types/DaBridge'
import { linkByDA } from '../../../utils/link-by-da'

export const enshrinedBridge: EnshrinedBridge = {
  id: 'enshrined-bridge',
  kind: DaBridgeKind.Enshrined,
  display: {
    name: 'Enshrined Bridge',
    slug: 'enshrined-bridge',
    description: 'Enshrined bridge on Ethereum',
  },
  usedIn: linkByDA({
    // To catch both blobs and calldata suffix
    layer: (layer) => layer?.startsWith('Ethereum'),
    bridge: (bridge) => bridge === 'Enshrined',
  }),
  risks: {
    accessibility: DaAccessibilityRisk.Enshrined,
    attestations: DaAttestationSecurityRisk.Enshrined,
    exitWindow: DaExitWindowRisk.Immutable,
    // we should add a note on the frontend that the specific rollup contracts could be upgradable and the security properties of each depend on the single rollup implementation
  },
} satisfies DaBridge
