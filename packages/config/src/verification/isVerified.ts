import type { Bridge } from '../projects/bridges'
import type { DaBridge, DaLayer } from '../projects/da-beat'
import type { Layer2 } from '../projects/layer2s'
import type { Layer3 } from '../projects/layer3s'

export function isVerified(
  project: Layer2 | Layer3 | Bridge | DaLayer,
): boolean {
  if (project.type === 'DaLayer') {
    return project.bridges.every((bridge) =>
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

      return e.contract.isVerified
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
