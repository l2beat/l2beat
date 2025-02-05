import type { Bridge, DaBridge, Layer2, Layer3 } from '../types'

// TODO(radomski): Permissions
export function isVerified(project: Layer2 | Layer3 | Bridge): boolean {
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
  if ('contracts' in daBridge) {
    return Object.values(daBridge.contracts?.addresses ?? {})
      .flat()
      .every((c) => c.isVerified)
  }
  return true
}
