import { aevo } from '../../../../../layer2s/aevo'
import { ancient } from '../../../../../layer2s/ancient'
import { hypr } from '../../../../../layer2s/hypr'
import { karak } from '../../../../../layer2s/karak'
import { lyra } from '../../../../../layer2s/lyra'
import { mantapacific } from '../../../../../layer2s/mantapacific'
import { orderly } from '../../../../../layer2s/orderly'
import { publicgoodsnetwork } from '../../../../../layer2s/publicgoodsnetwork'
import { stack } from '../../../../../layer3s/stack'
import { DaAccessibilityRisk, DaExitWindowRisk } from '../../../types'
import { DaAttestationSecurityRisk } from '../../../types/DaAttestationSecurityRisk'
import { DaBridge } from '../../../types/DaBridge'

/**
 * THIS IS EXAMPLE DATA FOR SKETCH PURPOSES
 */
export const noBridge = {
  id: 'no-bridge',
  type: 'NoBridge',
  display: {
    name: 'No Bridge',
    slug: 'no-bridge',
    description:
      'No bridge dolore occaecat excepteur consectetur sit excepteur et. Laborum ullamco occaecat irure consequat labore tempor sint sit est. Elit laborum incididunt reprehenderit voluptate exercitation cupidatat cupidatat sunt. Dolore fugiat ullamco ipsum ex aute eu incididunt ullamco.',
  },
  technology:
    'Some note about the technology used by the bridge.\n## Markdown supported',
  usedIn: [
    mantapacific.id,
    karak.id,
    aevo.id,
    lyra.id,
    publicgoodsnetwork.id,
    orderly.id,
    ancient.id,
    hypr.id,
    stack.id,
  ],
  risks: {
    accessibility: DaAccessibilityRisk.NotEnshrined,
    attestations: DaAttestationSecurityRisk.NoBridge,
    exitWindow: DaExitWindowRisk.NoBridge,
  },
} satisfies DaBridge
