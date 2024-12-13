import { Bridge, DaBridge, DaLayer, Layer2, Layer3 } from '../../projects'
import { getManuallyVerifiedContracts } from './getManuallyVerifiedContracts'

export function getProjectsVerificationStatuses(
  project: Layer2 | Layer3 | Bridge,
): boolean {
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
