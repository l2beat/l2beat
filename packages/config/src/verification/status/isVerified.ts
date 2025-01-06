import { Bridge, DaBridge, DaLayer, Layer2, Layer3 } from '../../projects'
import { getManuallyVerifiedContracts } from './getManuallyVerifiedContracts'

export function isVerified(
  project: Layer2 | Layer3 | Bridge | DaLayer,
): boolean {
  if (project.type === 'DaLayer') {
    return project.bridges.every((bridge) =>
      isDaBridgeVerified(project, bridge),
    )
  }

  const manual = getManuallyVerifiedContracts()
  const contractsVerification =
    project.contracts?.addresses.every((c) => {
      const isAutoVerified = 'isVerified' in c && c.isVerified
      const isManuallyVerified =
        'address' in c && c.address in (manual[c.chain ?? 'ethereum'] ?? {})
      return isAutoVerified || isManuallyVerified
    }) ?? true
  const escrowVerifications =
    project.config.escrows.every((c) => {
      if (!('contract' in c)) {
        return true
      }
      const isManuallyVerified =
        'address' in c.contract &&
        typeof c.contract.address === 'string' &&
        c.contract.address in (manual[c.chain] ?? {})

      return c.contract.isVerified || isManuallyVerified
    }) ?? true

  const newVerification = escrowVerifications && contractsVerification

  return newVerification
}

export function isDaBridgeVerified(_: DaLayer, daBridge: DaBridge): boolean {
  let verification = true

  if ('contracts' in daBridge) {
    verification =
      Object.values(daBridge.contracts?.addresses)
        .flat()
        .every((c) => 'isVerified' in c && c.isVerified) ?? false
  }

  return verification
}
