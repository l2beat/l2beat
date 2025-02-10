import type { BaseProject, Bridge, Layer2, Layer3 } from '../types'

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

export function isProjectVerified(project: BaseProject): boolean {
  return Object.values(project.contracts?.addresses ?? {})
    .flat()
    .every((c) => c.isVerified)
}
