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
      const isAutoVerified = c.isVerified
      const isManuallyVerified =
        c.address in (manual[c.chain ?? 'ethereum'] ?? {})
      return isAutoVerified || isManuallyVerified
    }) ?? true
  const escrowVerifications =
    project.config.escrows.every((e) => {
      if (!('contract' in e)) {
        return true
      }

      const isManuallyVerified =
        'address' in e.contract &&
        typeof e.contract.address === 'string' &&
        e.contract.address in (manual[e.chain] ?? {})

      return e.contract.isVerified || isManuallyVerified
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
        .every((c) => c.isVerified) ?? false
  }

  return verification
}
