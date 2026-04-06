import type { CompiledReview } from '../types'

export function deriveRadarData(review: CompiledReview) {
  const { admins, dependencies, totals, resources = [] } = review

  const hasEOA = admins.some(
    (a) => a.adminType === 'EOA' || a.adminType === 'EOAPermissioned',
  )
  const hasMultisig = admins.some((a) => a.adminType === 'Multisig')
  const isImmutable =
    admins.length > 0 &&
    admins.every(
      (a) => a.adminType === 'Immutable' || a.adminType === 'Revoked',
    )
  const depCount = dependencies.length
  const frontendCount = resources.filter((r) => r.type === 'frontend').length

  const control = isImmutable ? 90 : hasEOA ? 25 : hasMultisig ? 55 : 70
  const deps =
    depCount === 0 ? 90 : depCount <= 2 ? 70 : depCount <= 5 ? 50 : 30
  const access =
    frontendCount === 0
      ? 20
      : frontendCount === 1
        ? 50
        : frontendCount <= 3
          ? 75
          : 90
  const verifiability = totals.contractCount > 0 ? 75 : 50
  const exit = 65

  return [
    { axis: 'CONTROL', value: control },
    { axis: 'DEPENDENCIES', value: deps },
    { axis: 'ACCESS', value: access },
    { axis: 'VERIFIABILITY', value: verifiability },
    { axis: 'ABILITY TO EXIT', value: exit },
  ]
}
