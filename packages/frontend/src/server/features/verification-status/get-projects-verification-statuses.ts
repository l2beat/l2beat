import { type DaBridge, type DaLayer, type Project } from '@l2beat/config'
import { getManuallyVerifiedContracts } from './get-manually-verified-contracts'

export function getProjectsVerificationStatuses(project: Project): boolean {
  const manual = getManuallyVerifiedContracts(project)
  const contractsVerification =
    project.contracts?.addresses.every(
      (c) =>
        ('isVerified' in c && c.isVerified) ||
        ('address' in c && c.address in (manual[c.chain ?? 'ethereum'] ?? {})),
    ) ?? true
  const escrowVerifications =
    project.config.escrows.every((c) =>
      'contract' in c ? c.contract.isVerified : true,
    ) ?? true
  const newVerification = escrowVerifications && contractsVerification

  return newVerification
}

export function getDaBridgeVerification(
  _: DaLayer,
  daBridge: DaBridge,
): boolean {
  let verification = true

  if ('contracts' in daBridge) {
    verification =
      Object.values(daBridge.contracts?.addresses)
        .flat()
        .every((c) => 'isVerified' in c && c.isVerified) ?? false
  }

  return verification
}
