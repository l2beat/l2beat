import { DaAttestationSecurityRisk } from '../../../../types/DaAttestationSecurityRisk'
import { DaExitWindowRisk } from '../../../../types/DaExitWindowRisk'
import { CELESTIA_BLOBSTREAM } from './template'

export const blobStreamArbitrum = CELESTIA_BLOBSTREAM({
  chain: 'arbitrum',
  contracts: [],
  permissions: [],
  usedIn: [],
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerifiedZK(true),
    exitWindow: DaExitWindowRisk.SecurityCouncil(30 * 24 * 60 * 60),
  },
})
