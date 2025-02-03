import type { Bridge, DaBridge, DaProject, Layer2, Layer3 } from '../types'

// TODO(radomski): Permissions
export function isVerified(
  project: Layer2 | Layer3 | Bridge | DaProject,
): boolean {
  if (project.type === 'DaLayer') {
    return project.daLayer.bridges.every((bridge) => isDaBridgeVerified(bridge))
  }

  const contractsVerification = Object.values(
    project.contracts?.addresses ?? {},
  ).every((p) => p.every((c) => c.isVerified))
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

export function isDaBridgeVerified(daBridge: DaBridge): boolean {
  let verification = true

  if ('contracts' in daBridge) {
    verification =
      Object.values(daBridge.contracts?.addresses ?? {})
        .flat()
        .every((c) => c.isVerified) ?? false
  }

  return verification
}
