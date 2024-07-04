import { DaExitWindowRisk } from '../../../../types'
import { DaAttestationSecurityRisk } from '../../../../types/DaAttestationSecurityRisk'
import { CELESTIA_BLOBSTREAM } from './template'

export const blobstreamBase = CELESTIA_BLOBSTREAM({
  chain: 'base',
  contracts: [],
  permissions: [],
  usedIn: [],
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerifiedZK(true),
    exitWindow: DaExitWindowRisk.SecurityCouncil(30 * 24 * 60 * 60),
  },
})
