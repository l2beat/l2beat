import { DaExitWindowRisk } from '../../../../types'
import { DaAttestationSecurityRisk } from '../../../../types/DaAttestationSecurityRisk'
import { CELESTIA_BLOBSTREAM } from './template'

export const blobStreamBase = CELESTIA_BLOBSTREAM({
  chain: 'base',
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
