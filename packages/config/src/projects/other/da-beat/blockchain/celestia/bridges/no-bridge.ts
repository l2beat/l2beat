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
    description:
      'No bridge dolore occaecat excepteur consectetur sit excepteur et. Laborum ullamco occaecat irure consequat labore tempor sint sit est. Elit laborum incididunt reprehenderit voluptate exercitation cupidatat cupidatat sunt. Dolore fugiat ullamco ipsum ex aute eu incididunt ullamco.',
    warning: 'This has no bridge.',
    redWarning: 'This really has no bridge.',
  },
  technology:
    'Some note about the technology used by the bridge.\n## Markdown supported',
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
