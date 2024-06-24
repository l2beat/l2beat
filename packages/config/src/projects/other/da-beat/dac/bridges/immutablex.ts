import { ChainId } from '@l2beat/shared-pure'
import { immutablex } from '../../../../layer2s/immutablex'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge, DaBridgeKind } from '../../types/DaBridge'

/**
 * THIS IS EXAMPLE DATA FOR SKETCH PURPOSES
 */
export const immutableXDac = {
  id: 'immutablex-dac',
  kind: DaBridgeKind.DAC,
  display: {
    name: 'ImmutableX DAC',
    slug: 'immutablex-dac',
    description: 'ImmutableX DAC on Ethereum.',
  },
  chain: ChainId.ETHEREUM,
  requiredMembers: 5,
  totalMembers: 7,
  usedIn: [immutablex.id],
  risks: {
    attestations: DaAttestationSecurityRisk.NotVerified,
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.LowOrNoDelay(),
  },
} satisfies DaBridge
