import { DaAccessibilityRisk, DaExitWindowRisk } from '../../../types'
import { DaAttestationSecurityRisk } from '../../../types/DaAttestationSecurityRisk'
import { DaBridge, DaBridgeKind } from '../../../types/DaBridge'
import { linkByDA } from '../../../utils/link-by-da'

export const noBridge = {
  id: 'no-bridge',
  kind: DaBridgeKind.NoBridge,
  display: {
    name: 'No Bridge',
    slug: 'no-bridge',
    description: 'Celestia with no DA bridge',
  },
  usedIn: linkByDA({
    layer: (layer) => layer === 'Celestia',
    bridge: (bridge) => bridge === 'None',
  }),
  risks: {
    accessibility: DaAccessibilityRisk.NotEnshrined,
    attestations: DaAttestationSecurityRisk.NoBridge,
    exitWindow: DaExitWindowRisk.NoBridge,
  },
} satisfies DaBridge
