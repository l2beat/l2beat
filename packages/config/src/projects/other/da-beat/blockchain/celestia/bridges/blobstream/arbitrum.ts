import { DaAttestationSecurityRisk } from '../../../../types/DaAttestationSecurityRisk'
import { DaExitWindowRisk } from '../../../../types/DaExitWindowRisk'
import { CELESTIA_BLOBSTREAM } from './template'

export const blobStreamArbitrum = CELESTIA_BLOBSTREAM({
  chain: 'arbitrum',
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
