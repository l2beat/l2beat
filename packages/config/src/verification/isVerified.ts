import type { Bridge, DaBridge, DaProject, Layer2, Layer3 } from '../types'

export function isVerified(
  project: Layer2 | Layer3 | Bridge | DaProject,
): boolean {
  if (project.type === 'DaLayer') {
    return project.daLayer.bridges.every((bridge) =>
      isDaBridgeVerified(project, bridge),
    )
  }

  const contractsVerification =
    project.contracts?.addresses.every((c) => c.isVerified) ?? true
  const escrowVerifications =
    project.config.escrows.every((e) => {
      if (!('contract' in e)) {
        return true
      }

      return e.contract?.isVerified
    }) ?? true

  const newVerification = escrowVerifications && contractsVerification

  return newVerification
}

export function isDaBridgeVerified(_: DaProject, daBridge: DaBridge): boolean {
  let verification = true

  if ('contracts' in daBridge) {
    verification =
      Object.values(daBridge.contracts?.addresses)
        .flat()
        .every((c) => c.isVerified) ?? false
  }

  return verification
}
