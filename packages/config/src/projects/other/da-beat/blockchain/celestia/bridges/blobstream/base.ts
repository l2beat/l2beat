import { DaExitWindowRisk } from '../../../../types'
import { DaAttestationSecurityRisk } from '../../../../types/DaAttestationSecurityRisk'
import { CELESTIA_BLOBSTREAM } from './template'

export const blobStreamBase = CELESTIA_BLOBSTREAM({
  chain: 'base',
  technology:
    'Some note about the technology used by the bridge.\n## Markdown supported',
  contracts: {
    addresses: [],
    risks: [],
  },
  permissions: [],
  usedIn: [],
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerifiedZK(true),
    exitWindow: DaExitWindowRisk.SecurityCouncil(30 * 24 * 60 * 60),
  },
})
