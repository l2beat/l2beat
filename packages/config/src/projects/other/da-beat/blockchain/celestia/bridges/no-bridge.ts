import { DaAccessibilityRisk, DaExitWindowRisk } from '../../../types'
import { DaAttestationSecurityRisk } from '../../../types/DaAttestationSecurityRisk'
import { DaBridge } from '../../../types/DaBridge'
import { linkByDA } from '../../../utils/link-by-da'

export const noBridge = {
  id: 'no-bridge',
  type: 'NoBridge',
  display: {
    name: 'No Bridge',
    slug: 'no-bridge',
    description: 'This project does not have a DA bridge on Ethereum.',
    redWarning:
      'Without a DA bridge, Ethereum has no proof of data availability for this project.',
    links: {
      websites: [],
      documentation: [],
      repositories: [],
      apps: [],
      explorers: [],
      socialMedia: [],
    },
  },
  technology: `There is no DA bridge on Ethereum.\n`,
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
